import { filter, flatMap } from 'rxjs/operators';
import { concat, Observable, of } from 'rxjs';
import { ofType } from 'deox';
import { ac_, store } from '::store/store';
import { Actions } from '../../actions.types';
import { createErrorHandler } from '::store/epics/shared/create-error-handler';
import {
  FetchContentProps,
  fetchNodeHtml,
  fetchNodeImages,
} from '::store/epics/fetch-node/fetch-node';
import { unFlatMap } from '::helpers/array-helpers';

const progressify = <T>(
  propsArray: T[],
  action: (T) => Observable<any>,
  onProgress: (number) => Observable<any>,
) => {
  const state = {
    totalProps: propsArray.length,
    count: 0,
  };
  return concat(
    ...propsArray.map(prop =>
      concat(
        action(prop),
        onProgress((++state.count / state.totalProps) * 100),
      ),
    ),
  );
};
const mapToProps = (documentId: string) => (node_ids: number[]) => ({
  node_ids,
  documentId,
});
const fetchAllNodesEpic = (action$: Observable<Actions>) => {
  return action$.pipe(
    ofType([ac_.node.fetchAll]),
    filter(({ payload: documentId }) => {
      return (
        store.getState().node.asyncOperations.fetchAll[documentId]?.status !==
        'in-progress'
      );
    }),
    flatMap(({ payload: documentId }) => {
      const fulfilled$ = concat(
        of(ac_.node.setFetchAllStatus(documentId, 'idle')),
        of(ac_.dialogs.setSnackbar({ message: documentId + ' is cached' })),
      );

      const document = store.getState().documentCache.documents[documentId];
      const nodesWithNoHtml = Object.values(document.nodes)
        .filter(node => !node.html && node.node_id)
        .map(node => +node.node_id);

      const nodesWithNoImages = Object.values(document.nodes)
        .filter(node => !node?.image?.length && node.node_id)
        .map(node => +node.node_id);

      const fetchNodesHtml$ = progressify<FetchContentProps>(
        unFlatMap(50)(nodesWithNoHtml).map(mapToProps(documentId)),
        fetchNodeHtml,
        progress =>
          of(
            ac_.node.setFetchAllStatus(
              documentId,
              'in-progress',
              'text',
              progress,
            ),
          ),
      );

      const fetchNodesImages$ = progressify<FetchContentProps>(
        unFlatMap(15)(nodesWithNoImages).map(mapToProps(documentId)),
        fetchNodeImages,
        progress =>
          of(
            ac_.node.setFetchAllStatus(
              documentId,
              'in-progress',
              'images',
              progress,
            ),
          ),
      );

      return concat(fetchNodesHtml$, fetchNodesImages$, fulfilled$).pipe(
        createErrorHandler({
          alertDetails: {
            title: 'Could not fetch the nodes',
            description: 'Check your network connection',
          },
          actionCreators: [
            () => ac_.node.setFetchAllStatus(documentId, 'idle'),
          ],
        }),
      );
    }),
  );
};

export { fetchAllNodesEpic };

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
import { unFlatMap } from '::helpers/shared';
import {
  DocumentOperation,
  OPERATION_CONTEXT,
  OPERATION_STATE,
  OPERATION_TYPE,
} from '::types/graphql';
import { CachedDocument } from '::store/ducks/cache/document-cache';
import { doKey } from '::store/ducks/document-operation/reducers/add-document-operations';
import { progressify } from '::helpers/shared';

const mapToProps = (documentId: string) => (node_ids: number[]) => ({
  node_ids,
  documentId,
});

const createCacheOperation = (document: CachedDocument) => (
  state: OPERATION_STATE,
  progress: number,
  context?: OPERATION_CONTEXT,
): DocumentOperation => ({
  target: {
    id: document.id,
    hash: document.hash,
    name: document.name,
  },
  type: OPERATION_TYPE.CACHE,
  userId: document.userId,
  state,
  progress,
  context,
});

const fetchAllNodesEpic = (action$: Observable<Actions>) => {
  return action$.pipe(
    ofType([ac_.node.fetchAll]),
    filter(({ payload: documentId }) => {
      return !store.getState().documentOperations[
        doKey({
          target: { id: documentId },
          type: OPERATION_TYPE.CACHE,
        } as DocumentOperation)
      ];
    }),
    flatMap(({ payload: documentId }) => {
      const state = store.getState();
      const document = state.documentCache.documents[documentId];
      const cacheOperation = createCacheOperation(document);
      const fulfilled$ = of(
        ac_.documentOperations.add(cacheOperation(OPERATION_STATE.FINISHED, 1)),
      );

      const nodesWithNoHtml = Object.values(document.nodes)
        .filter(node => !node.html && node.node_id)
        .map(node => +node.node_id);

      const nodesWithNoImages = Object.values(document.nodes)
        .filter(node => !node?.image?.length && node.node_id)
        .map(node => +node.node_id);

      const fetchNodesHtml$ = progressify<FetchContentProps>(
        unFlatMap(100)(nodesWithNoHtml).map(mapToProps(documentId)),
        fetchNodeHtml,
        progress =>
          of(
            ac_.documentOperations.add(
              cacheOperation(
                OPERATION_STATE.STARTED,
                progress,
                OPERATION_CONTEXT.NODES,
              ),
            ),
          ),
      );

      const fetchNodesImages$ = progressify<FetchContentProps>(
        unFlatMap(10)(nodesWithNoImages).map(mapToProps(documentId)),
        fetchNodeImages,
        progress =>
          of(
            ac_.documentOperations.add(
              cacheOperation(
                OPERATION_STATE.STARTED,
                progress,
                OPERATION_CONTEXT.IMAGES,
              ),
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
            () =>
              ac_.documentOperations.add(
                cacheOperation(OPERATION_STATE.FAILED, 0),
              ),
          ],
        }),
      );
    }),
  );
};

export { fetchAllNodesEpic };

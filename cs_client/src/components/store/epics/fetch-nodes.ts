import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { concat, from, Observable, ObservedValueOf, of } from 'rxjs';
import { ofType } from 'deox';
import { apolloCache } from '::graphql/cache/apollo-cache';
import { QUERY_NODE_META } from '::graphql/queries';
import { store } from '::root/store';
import { constructTree } from '::app/editor/document/hooks/get-document-meta/helpers/construct-tree';
import { clearLocalChanges } from '::app/editor/document/hooks/get-document-meta/helpers/clear-local-changes';
import { Actions } from '../actions.types';
import { documentActionCreators } from '::root/store/ducks/document';
import { handleErrors } from '::app/editor/document/hooks/get-document-meta/helpers/handle-errors';
import { NodeMeta } from '::types/graphql/adapters';

const createLocalRequest = (
  file_id: string,
): Observable<ObservedValueOf<Promise<NodeMeta[]>>> => {
  const nodes = new Promise<NodeMeta[]>(res => {
    const nodes = apolloCache.document.get(file_id)?.node as NodeMeta[];
    if (!nodes) {
      throw new Error(file_id + ' does not exist');
    }
    res(nodes);
  });
  return from(nodes);
};
const createNetworkRequest = (file_id: string) =>
  from(
    apolloCache.client.query({
      query: QUERY_NODE_META.query,
      path: QUERY_NODE_META.path,
      variables: {
        file_id,
      },
      fetchPolicy: 'network-only',
    }),
  ).pipe(
    tap(() => {
      clearLocalChanges();
    }),
  );

const fetchNodesEpic = (action$: Observable<Actions>) => {
  const selectedDocumentId = () => store.getState().document.documentId;
  return action$.pipe(
    ofType([
      documentActionCreators.fetchNodes,
      documentActionCreators.setDocumentId,
    ]),
    // debounceTime(500),
    switchMap(action => {
      // @ts-ignore
      const file_id = action.payload ? action.payload : selectedDocumentId();
      const isNewDocument = file_id?.startsWith('new-document');
      const request = (isNewDocument
        ? (createLocalRequest(file_id) as Observable<any>)
        : createNetworkRequest(file_id)
      ).pipe(
        map(nodes => constructTree({ nodes })),
        map(nodesMap => documentActionCreators.fetchNodesFulfilled(nodesMap)),
      );

      const loading = of(documentActionCreators.fetchNodesStarted());
      const resetCache = of(
        documentActionCreators.setCacheTimeStamp(isNewDocument ? undefined : 0),
      );
      return concat(loading, request, resetCache).pipe(
        catchError(error => {
          handleErrors({ file_id, documentId: selectedDocumentId(), error });
          return error;
        }),
      );
    }),
  );
};

export { fetchNodesEpic };

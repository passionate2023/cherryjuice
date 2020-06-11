import { catchError, filter, map, switchMap } from 'rxjs/operators';
import { concat, from, Observable, ObservedValueOf, of } from 'rxjs';
import { ofType } from 'deox';
import { apolloCache } from '::graphql/cache/apollo-cache';
import { QUERY_NODE_META } from '::graphql/queries';
import { store } from '::root/store/store';
import { constructTree } from '::app/editor/document/hooks/get-document-meta/helpers/construct-tree';
import { Actions } from '../actions.types';
import { documentActionCreators } from '::root/store/ducks/document';
import { handleErrors } from '::app/editor/document/hooks/get-document-meta/helpers/handle-errors';
import { NodeMeta } from '::types/graphql/adapters';
import { gqlQuery } from '::root/store/epics/shared/gql-query';

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

const fetchNodesEpic = (action$: Observable<Actions>) => {
  const selectedDocumentId = () => store.getState().document.documentId;
  return action$.pipe(
    ofType([
      documentActionCreators.fetchNodes,
      documentActionCreators.setDocumentId,
    ]),
    map(action =>
      'payload' in action ? action.payload : selectedDocumentId(),
    ),
    filter(Boolean),
    switchMap((file_id: string) => {
      const isNewDocument = file_id?.startsWith('new-document');
      const request = (isNewDocument
        ? createLocalRequest(file_id)
        : gqlQuery({
            ...QUERY_NODE_META,
            variables: { file_id },
          })
      ).pipe(
        map(nodes => constructTree({ nodes })),
        map(nodesMap => documentActionCreators.fetchNodesFulfilled(nodesMap)),
      );

      const loading = of(documentActionCreators.fetchNodesStarted());
      return concat(loading, request).pipe(
        catchError(error =>
          of(
            handleErrors({
              file_id,
              documentId: selectedDocumentId(),
              error,
            }),
          ),
        ),
      );
    }),
  );
};

export { fetchNodesEpic };

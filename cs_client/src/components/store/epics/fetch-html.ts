import { catchError, map, switchMap } from 'rxjs/operators';
import { concat, Observable, of } from 'rxjs';
import { ofType } from 'deox';
import { apolloCache } from '::graphql/cache/apollo-cache';
import { QUERY_NODE_CONTENT } from '::graphql/queries';
import { store } from '::root/store';
import { Actions } from '../actions.types';
import { documentActionCreators } from '::root/store/ducks/document';
import { NodeHtml } from '::types/graphql/adapters';
import { gqlQuery } from '::root/store/epics/shared/gql-query';
import { nodeActionCreators } from '::root/store/ducks/node';

const fetchHtmlEpic = (action$: Observable<Actions>) => {
  const selectedNode_id = () => store.getState().node.node_id;
  const selectedNodeId = () => store.getState().node.nodeId;
  const file_id = () => store.getState().document.documentId;
  return action$.pipe(
    ofType([]),
    switchMap(action => {
      const node_id =
        'payload' in action ? action?.payload.node_id : selectedNode_id();

      const request = gqlQuery<any, NodeHtml>({
        ...QUERY_NODE_CONTENT.html,
        variables: {
          file_id: file_id(),
          node_id,
        },
      }).pipe(map(({ html }) => nodeActionCreators.fetchFulfilled(html)));

      const loading = of(nodeActionCreators.fetchStarted());
      return concat(loading, request).pipe(
        catchError(error => {
          const nodeIsNew = apolloCache.changes.isNodeNew(selectedNodeId());
          if (!nodeIsNew) {
            documentActionCreators.setDocumentId(file_id());
          }
          return error;
        }),
      );
    }),
  );
};

export { fetchHtmlEpic };

import { filter, map, switchMap, tap } from 'rxjs/operators';
import { concat, from, Observable, ObservedValueOf, of } from 'rxjs';
import { ofType } from 'deox';
import { apolloCache } from '::graphql/cache/apollo-cache';
import { QUERY_NODE_META } from '::graphql/queries';
import { store, ac } from '::root/store/store';
import {
  constructTree,
  applyLocalModifications,
} from '::app/editor/document/hooks/get-document-meta/helpers/construct-tree';
import { Actions } from '../actions.types';
import { handleFetchError } from '::app/editor/document/hooks/get-document-meta/helpers/handle-fetch-error';
import { NodeMeta } from '::types/graphql/adapters';
import { gqlQuery } from '::root/store/epics/shared/gql-query';
import { createTimeoutHandler } from './shared/create-timeout-handler';
import { createErrorHandler } from './shared/create-error-handler';

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
    ofType([ac.__.document.fetchNodes, ac.__.document.setDocumentId]),
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
        tap(() => {
          apolloCache.changes.initDocumentChangesState(file_id);
        }),
        map(nodes => constructTree({ nodes })),
        map(nodes => applyLocalModifications({ nodes, file_id })),
        map(nodesMap => ac.__.document.fetchNodesFulfilled(nodesMap)),
      );

      const loading = of(ac.__.document.fetchNodesStarted());
      return concat(loading, request).pipe(
        createTimeoutHandler({
          alertDetails: {
            title: 'Fetching the document is taking longer then expected',
            description: 'try refreshing the page',
          },
          due: 15000,
        }),
        createErrorHandler({
          dontShowAlert: isNewDocument,
          alertDetails: {
            title: 'Could not fetch the document',
            description: 'Check your network connection',
          },
          actionCreators: [
            handleFetchError({
              documentIdBeingFetched: file_id,
              previousDocumentId: selectedDocumentId(),
            }),
          ],
        }),
      );
    }),
  );
};

export { fetchNodesEpic };

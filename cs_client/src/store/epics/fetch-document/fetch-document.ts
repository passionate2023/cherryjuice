import { filter, map, switchMap } from 'rxjs/operators';
import { concat, from, Observable, ObservedValueOf, of } from 'rxjs';
import { ofType } from 'deox';
import { store, ac } from '../../store';
import { Actions } from '../../actions.types';
import { handleFetchError } from '::root/components/app/components/editor/document/hooks/get-document-meta/helpers/handle-fetch-error';
import { gqlQuery } from '../shared/gql-query';
import { createTimeoutHandler } from '../shared/create-timeout-handler';
import { createErrorHandler } from '../shared/create-error-handler';
import { QDocumentMeta, DOCUMENT_META } from '::graphql/queries/document-meta';
import { getDocuments } from '::store/selectors/cache/document/document';

const createLocalRequest = (
  file_id: string,
): Observable<ObservedValueOf<Promise<QDocumentMeta>>> => {
  const document = new Promise<QDocumentMeta>(res => {
    const document = getDocuments(store.getState())[file_id];
    if (!document?.nodes) {
      throw new Error(file_id + ' does not exist');
    }
    const node = Object.values(document.nodes);
    delete document.nodes;

    const rawDocument: QDocumentMeta = {
      ...document,
      node: node,
    };
    res(rawDocument);
  });
  return from(document);
};

const fetchDocumentEpic = (action$: Observable<Actions>) => {
  const selectedDocumentId = () => store.getState().document.documentId;
  return action$.pipe(
    ofType([
      ac.__.document.fetch,
      ac.__.document.setDocumentId,
      ac.__.document.saveFulfilled,
    ]),
    filter(action => {
      if (action.type === ac.__.document.setDocumentId.type) {
        const document = store.getState().documentCache[action.payload];
        if (document?.nodes && document?.nodes[0]) {
          return false;
        }
      }
      return true;
    }),
    map(action =>
      'payload' in action ? action.payload : selectedDocumentId(),
    ),
    filter(Boolean),
    switchMap((file_id: string) => {
      const isNewDocument = file_id?.startsWith('new-document');
      const request = (isNewDocument
        ? createLocalRequest(file_id)
        : gqlQuery(DOCUMENT_META({ file_id }))
      ).pipe(map(ac.__.document.fetchFulfilled));

      const loading = of(ac.__.document.fetchInProgress());
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
            action: {
              name: 'select a document',
              callbacks: [ac.dialogs.clearAlert, ac.dialogs.showDocumentList],
            },
          },
          actionCreators: [
            handleFetchError({
              documentIdBeingFetched: file_id,
              previousDocumentId: selectedDocumentId(),
              userId: store.getState().auth.user?.id,
            }),
          ],
        }),
      );
    }),
  );
};

export { fetchDocumentEpic };

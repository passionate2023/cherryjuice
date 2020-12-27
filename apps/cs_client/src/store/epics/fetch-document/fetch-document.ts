import { filter, flatMap, map, switchMap, tap } from 'rxjs/operators';
import { concat, from, Observable, ObservedValueOf, of } from 'rxjs';
import { ofType } from 'deox';
import { store, ac_, ac } from '../../store';
import { Actions } from '../../actions.types';
import { handleFetchError } from '::root/components/app/components/editor/document/hooks/get-document-meta/helpers/handle-fetch-error';
import { gqlQuery$ } from '../shared/gql-query';
import { createTimeoutHandler } from '../shared/create-timeout-handler';
import { createErrorHandler } from '../shared/create-error-handler';
import { QDocumentMeta, DOCUMENT_META } from '::graphql/queries/document-meta';
import { getDocuments } from '::store/selectors/cache/document/document';
import { pagesManager } from '@cherryjuice/editor';
import { adaptToPersistedState } from '::store/ducks/document-cache/helpers/document/shared/adapt-persisted-state';
import { alerts } from '::helpers/texts/alerts';

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

    const persistedState = adaptToPersistedState(document.persistedState);
    delete document.persistedState;
    const rawDocument: QDocumentMeta = {
      ...document,
      state: persistedState,
      node: node,
    };
    res(rawDocument);
  });
  return from(document);
};

const fetchDocumentEpic = (action$: Observable<Actions>) => {
  const selectedDocumentId = () => {
    const document = store.getState().document;
    return document.swappedIds[document.documentId] || document.documentId;
  };
  return action$.pipe(
    ofType([
      ac_.document.fetch,
      ac_.document.setDocumentId,
      ac_.document.saveFulfilled,
    ]),
    filter(action => {
      if (action.type === ac_.document.setDocumentId.type) {
        const document = store.getState().documentCache.documents[
          action['payload']
        ];
        if (document?.nodes && document?.nodes[0]) {
          return false;
        }
      }
      return true;
    }),
    map(action =>
      'payload' in action ? action['payload'] : selectedDocumentId(),
    ),
    filter(Boolean),
    switchMap((file_id: string) => {
      const isNewDocument = file_id?.startsWith('new-document');
      const request = (isNewDocument
        ? createLocalRequest(file_id)
        : gqlQuery$(DOCUMENT_META({ file_id }))
      ).pipe(
        tap(() => {
          pagesManager.resetPages(id => id.startsWith(file_id));
        }),
        flatMap(document => {
          if (!document?.id) return of(ac_.document.fetchFailed());
          const next = store.getState().node.next;
          if (next && next.documentId === document.id)
            return concat(
              of(ac_.node.clearNext()),
              of(ac_.document.fetchFulfilled(document, next)),
            );
          else return of(ac_.document.fetchFulfilled(document));
        }),
      );

      const loading = of(ac_.document.fetchInProgress());
      return concat(loading, request).pipe(
        createTimeoutHandler({
          alertDetails: {
            title: 'Fetching the document is taking longer then expected',
            description: alerts.tryRefreshingThePage,
          },
          due: 15000,
          mode: 'snackbar',
        }),
        createErrorHandler({
          dontShowAlert: isNewDocument,
          alertDetails: {
            title: 'Could not fetch the document',
            description: alerts.somethingWentWrong,
            action: {
              name: 'select a document',
              callbacks: [ac.dialogs.clearAlert, ac.dialogs.showDocumentList],
            },
          },
          actionCreators: handleFetchError(),
          mode: 'snackbar',
        }),
      );
    }),
  );
};

export { fetchDocumentEpic };

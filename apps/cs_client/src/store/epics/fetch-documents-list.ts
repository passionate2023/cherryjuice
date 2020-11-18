import { filter, flatMap, ignoreElements, switchMap } from 'rxjs/operators';
import { concat, EMPTY, Observable, of } from 'rxjs';
import { ofType } from 'deox';
import { store, ac_ } from '../store';
import { Actions } from '../actions.types';
import { gqlQuery$ } from './shared/gql-query';
import { createTimeoutHandler } from './shared/create-timeout-handler';
import { createErrorHandler } from './shared/create-error-handler';
import { DOCUMENTS_LIST } from '::graphql/queries/documents-list';
import { LoadDocumentsListPayload } from '::store/ducks/document-cache/helpers/document/load-documents-list';
import { QDocumentsListItem } from '::graphql/fragments/document-list-item';
import { alerts } from '::helpers/texts/alerts';

const maybeSelectMostRecentDocument$ = (
  documents: LoadDocumentsListPayload,
) => {
  const selectedDocument = store.getState().document.documentId;

  const sorted = documents.sort(
    (a: QDocumentsListItem, b: QDocumentsListItem): number =>
      a.state.lastOpenedAt - b.state.lastOpenedAt,
  );
  const mostRecentDocument = sorted[sorted.length - 1];

  if (!selectedDocument && mostRecentDocument)
    return of(ac_.document.setDocumentId(mostRecentDocument.id));
  else return EMPTY.pipe(ignoreElements());
};

const fetchDocumentsListEpic = (action$: Observable<Actions>) => {
  return action$.pipe(
    ofType([
      ac_.documentsList.fetchDocuments,
      ac_.documentsList.deleteDocumentsFulfilled,
      ac_.document.saveFulfilled,
    ]),
    filter(() => store.getState().documentsList.fetchDocuments === 'idle'),
    switchMap(() => {
      const request = gqlQuery$(DOCUMENTS_LIST()).pipe(
        flatMap(documents => {
          return concat(
            of(ac_.documentsList.fetchDocumentsFulfilled(documents)),
            maybeSelectMostRecentDocument$(documents),
          );
        }),
      );

      const loading = of(ac_.documentsList.fetchDocumentsInProgress());
      return concat(loading, request).pipe(
        createTimeoutHandler({
          alertDetails: {
            title: 'Fetching the documents is taking longer then expected',
            description: alerts.tryRefreshingThePage,
          },
          due: 15000,
          mode: 'snackbar',
        }),
        createErrorHandler({
          alertDetails: {
            title: 'Could not fetch the documents list',
            description: alerts.somethingWentWrong,
          },
          actionCreators: [],
          mode: 'snackbar',
        }),
      );
    }),
  );
};

export { fetchDocumentsListEpic };

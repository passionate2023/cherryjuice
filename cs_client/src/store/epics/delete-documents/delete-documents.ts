import { filter, ignoreElements, map, switchMap, tap } from 'rxjs/operators';
import { concat, from, Observable, of } from 'rxjs';
import { ofType } from 'deox';
import { ac, store } from '../../store';
import { Actions } from '../../actions.types';
import { gqlMutation } from '../shared/gql-query';
import { createErrorHandler } from '../shared/create-error-handler';
import { AsyncOperation } from '../../ducks/document';
import { DELETE_DOCUMENT } from '::graphql/mutations/document/delete-document';
import { deleteLocalDocuments } from '::root/components/app/components/menus/dialogs/documents-list/hooks/delete-documents/helpers/delete-local-documents';

const asyncStates: AsyncOperation[] = ['idle', 'pending'];
const deleteDocumentsEpic = (action$: Observable<Actions>) => {
  return action$.pipe(
    ofType([
      ac.__.documentsList.deleteDocuments,
      ac.__.documentsList.deleteDocument,
    ]),
    filter(() =>
      asyncStates.includes(store.getState().documentsList.deleteDocuments),
    ),
    switchMap(action => {
      let selectedIDs: string[];
      if ('payload' in action) {
        selectedIDs = [action['payload']];
      } else selectedIDs = store.getState().documentsList.selectedIDs;
      const { documentId } = store.getState().document;
      const fetchedDocuments = selectedIDs.filter(
        id => !id.startsWith('new-document'),
      );
      const ip = of(ac.__.documentsList.deleteDocumentsInProgress());
      const deleteFetchedDocuments = gqlMutation(
        DELETE_DOCUMENT({ documents: { IDs: fetchedDocuments } }),
      );
      const deleteUnsavedDocuments = from(
        new Promise(res => {
          deleteLocalDocuments({ IDs: selectedIDs });
          res();
        }),
      );
      return concat(
        ip,
        deleteUnsavedDocuments.pipe(ignoreElements()),
        deleteFetchedDocuments.pipe(
          map(ac.__.documentsList.deleteDocumentsFulfilled),
          tap(() => {
            if (
              store.getState().documentsList.selectedIDs.includes(documentId)
            ) {
              ac.document.setDocumentId(undefined);
            }
          }),
        ),
      ).pipe(
        createErrorHandler({
          alertDetails: {
            title: 'Could not perform the deletion',
            description: 'something went wrong',
          },
          actionCreators: [ac.__.documentsList.deleteDocumentsFailed],
        }),
      );
    }),
  );
};

export { deleteDocumentsEpic };

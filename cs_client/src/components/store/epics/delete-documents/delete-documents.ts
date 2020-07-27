import { filter, ignoreElements, map, switchMap, tap } from 'rxjs/operators';
import { concat, from, Observable, of } from 'rxjs';
import { ofType } from 'deox';
import { ac, store } from '::root/store/store';
import { Actions } from '::root/store/actions.types';
import { gqlMutation } from '::root/store/epics/shared/gql-query';
import { createErrorHandler } from '::root/store/epics/shared/create-error-handler';
import { AsyncOperation } from '::root/store/ducks/document';
import { DELETE_DOCUMENT } from '::graphql/mutations/delete-document';
import { deleteLocalDocuments } from '::app/menus/select-file/hooks/delete-documents/helpers/delete-local-documents';

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

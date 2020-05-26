import { catchError, map, switchMap } from 'rxjs/operators';
import { concat, from, Observable } from 'rxjs';
import { ofType } from 'deox';
import { ac, Actions } from '../ducks/actions.types';
import { documentActionCreators } from '::root/store/ducks/document';
import { saveDocument } from '::app/editor/document/hooks/save-document/save-document';
import { swapPersistedTreeStateDocumentId } from '::app/editor/document/tree/node/hooks/persisted-tree-state/helpers';
import { appActionCreators } from '::app/reducer';
import { SnackbarMessages } from '::shared-components/snackbar/snackbar-messages';
import { AlertType } from '::types/react';
import { SaveOperationState } from '::app/editor/document/hooks/save-document/helpers/save-deleted-nodes';

const postSave = (state: SaveOperationState) => {
  appActionCreators.setSnackbarMessage(SnackbarMessages.documentSaved);
  const createdDocuments = Object.values(state.swappedDocumentIds);
  if (createdDocuments.length)
    swapPersistedTreeStateDocumentId(state.swappedDocumentIds);

  if (location.pathname.startsWith('/document/new-document')) {
    const newDocumentId = createdDocuments.pop();
    appActionCreators.selectFile(newDocumentId);
    return ac.document.setDocumentId(newDocumentId);
  } else {
    return ac.document.fetchNodes();
  }
};

const saveEpic = (action$: Observable<Actions>) => {
  return action$.pipe(
    ofType([documentActionCreators.save]),
    switchMap(() => {
      const save = from(saveDocument()).pipe(map(postSave));

      return concat(save).pipe(
        catchError(error => {
          appActionCreators.setAlert({
            title: 'Could not save',
            description: 'Check your network connection',
            type: AlertType.Error,
            error,
          });
          return error;
        }),
      );
    }),
  );
};

export { saveEpic };

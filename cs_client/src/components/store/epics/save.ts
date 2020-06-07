import { map, switchMap } from 'rxjs/operators';
import { concat, from, Observable } from 'rxjs';
import { ofType } from 'deox';
import { ac, Actions } from '../actions.types';
import { documentActionCreators } from '::root/store/ducks/document';
import { saveDocument } from '::app/editor/document/hooks/save-document/save-document';
import { swapPersistedTreeStateDocumentId } from '::app/editor/document/tree/node/hooks/persisted-tree-state/helpers';
import { appActionCreators } from '::app/reducer';
import { SnackbarMessages } from '::shared-components/snackbar/snackbar-messages';
import { SaveOperationState } from '::app/editor/document/hooks/save-document/helpers/save-deleted-nodes';
import { resetCache } from '::root/store/epics/shared/clear-cache';
import { createErrorHandler } from '::root/store/epics/shared/create-error-handler';
import { updateCachedHtmlAndImages } from '::app/editor/document/tree/node/helpers/apollo-cache';

const postSave = (state: SaveOperationState) => {
  appActionCreators.setSnackbarMessage(SnackbarMessages.documentSaved);
  const createdDocuments = Object.values(state.swappedDocumentIds);
  if (createdDocuments.length)
    swapPersistedTreeStateDocumentId(state.swappedDocumentIds);

  if (location.pathname.startsWith('/document/new-document')) {
    const newDocumentId = createdDocuments.pop();
    return ac.document.setDocumentId(newDocumentId);
  } else {
    return ac.document.fetchNodes();
  }
};
const updateCacheAndSave = () => {
  updateCachedHtmlAndImages();
  return saveDocument();
};
const saveEpic = (action$: Observable<Actions>) => {
  return action$.pipe(
    ofType([documentActionCreators.save]),
    switchMap(() => {
      const save = from(updateCacheAndSave()).pipe(map(postSave));
      return concat(save, resetCache);
    }),
    createErrorHandler('Could not save', 'Check your network connection'),
  );
};

export { saveEpic };

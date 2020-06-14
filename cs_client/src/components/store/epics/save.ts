import { ignoreElements, map, switchMap } from 'rxjs/operators';
import { concat, defer, from, Observable, of } from 'rxjs';
import { ofType } from 'deox';
import { Actions } from '../actions.types';
import { saveDocument } from '::app/editor/document/hooks/save-document/save-document';
import { swapPersistedTreeStateDocumentId } from '::app/editor/document/tree/node/hooks/persisted-tree-state/helpers';
import { appActionCreators } from '::app/reducer';
import { SnackbarMessages } from '::shared-components/snackbar/snackbar-messages';
import { SaveOperationState } from '::app/editor/document/hooks/save-document/helpers/save-deleted-nodes';
import { resetCache } from '::root/store/epics/shared/clear-cache';
import { createErrorHandler } from '::root/store/epics/shared/create-error-handler';
import { updateCachedHtmlAndImages } from '::app/editor/document/tree/node/helpers/apollo-cache';
import { ac } from '../store';

const updateCachedHtmlAndImagesPromisified = () =>
  new Promise(res => {
    updateCachedHtmlAndImages();
    res();
  });

const postSave = (state: SaveOperationState) => {
  appActionCreators.setSnackbarMessage(SnackbarMessages.documentSaved);
  const createdDocuments = Object.values(state.swappedDocumentIds);
  if (createdDocuments.length)
    swapPersistedTreeStateDocumentId(state.swappedDocumentIds);

  if (location.pathname.startsWith('/document/new-document')) {
    const newDocumentId = createdDocuments.pop();
    return ac.__.document.setDocumentId(newDocumentId);
  } else {
    return ac.__.document.fetchNodes();
  }
};

const saveEpic = (action$: Observable<Actions>) => {
  return action$.pipe(
    ofType([ac.__.document.save]),
    switchMap(() => {
      const state: SaveOperationState = {
        newFatherIds: {},
        swappedDocumentIds: {},
        swappedNodeIds: {},
        swappedImageIds: {},
        danglingNodes: {},
        deletedNodes: {},
      };

      const save = defer(() =>
        from(saveDocument(state)).pipe(map(ac.__.document.saveFulfilled)),
      );
      const updateCache = defer(() =>
        of(updateCachedHtmlAndImagesPromisified()),
      ).pipe(ignoreElements());
      const sip = of(ac.__.document.saveInProgress());
      const ps = defer(() => of(postSave(state)));
      return concat(sip, updateCache, save, resetCache, ps);
    }),
    createErrorHandler({
      errorDetails: {
        title: 'Could not save',
        description: 'Check your network connection',
      },
      actionCreators: [ac.__.document.saveFailed],
    }),
  );
};

export { saveEpic };

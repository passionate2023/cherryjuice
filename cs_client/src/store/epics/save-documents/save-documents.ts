import { filter, ignoreElements, mapTo, switchMap, tap } from 'rxjs/operators';
import { concat, defer, EMPTY, from, Observable, of } from 'rxjs';
import { ofType } from 'deox';
import { Actions } from '../../actions.types';
import { SaveOperationState } from '::store/epics/save-documents/helpers/save-document/helpers/save-deleted-nodes';
import { createErrorHandler } from '../shared/create-error-handler';
import { createTimeoutHandler } from '../shared/create-timeout-handler';
import { saveDocuments } from '::store/epics/save-documents/helpers/save-document/save-documents';
import { ac, ac_, store } from '../../store';
import { createSaveState } from '::store/epics/save-documents/helpers/save-document/helpers/shared';
import { resetCache } from '::store/epics/save-documents/helpers/reset-cache';
import { Epic } from 'redux-observable';
import { SnackbarMessages } from '::root/components/app/components/menus/widgets/components/snackbar/snackbar-messages';
import { getEditedDocuments } from '::store/selectors/cache/document/document';
import { updateCachedHtmlAndImages } from '::root/components/app/components/editor/document/components/tree/components/node/helpers/apollo-cache';

const saveDocumentsEpic: Epic = (action$: Observable<Actions>) => {
  return action$.pipe(
    ofType([ac_.document.save]),
    filter(() => store.getState().document.asyncOperations.save === 'idle'),
    switchMap( () => {
      const state: SaveOperationState = createSaveState();
      updateCachedHtmlAndImages();
      const editedDocuments = getEditedDocuments();
      if (!editedDocuments.length) return of(ac_.document.nothingToSave());
      else {
        const saveInProgress$ = of(ac_.document.saveInProgress());
        const saveDocuments$ = defer(() =>
          from(saveDocuments(state, editedDocuments)).pipe(
            tap(resetCache),
            mapTo(ac_.document.cacheReset()),
          ),
        );
        const saveFulfilled$ = defer(() =>
          of(ac_.document.saveFulfilled(state.newSelectedDocumentId)).pipe(
            tap(() => {
              ac.dialogs.setSnackbar(SnackbarMessages.documentSaved);
            }),
          ),
        );
        const maybeRedirectToNewDocument$ = defer(() => {
          if (state.newSelectedDocumentId) {
            return of(ac_.document.setDocumentId(state.newSelectedDocumentId));
          } else return EMPTY.pipe(ignoreElements());
        });
        return concat(
          saveInProgress$,
          saveDocuments$,
          saveFulfilled$,
          maybeRedirectToNewDocument$,
        ).pipe(
          createTimeoutHandler({
            alertDetails: {
              title: 'Saving is taking longer then expected',
              description: 'try refreshing the page',
            },
            due: 5 * 60000,
          }),
          createErrorHandler({
            alertDetails: {
              title: 'Could not save',
              description: 'Check your network connection',
            },
            actionCreators: [ac_.document.saveFailed],
          }),
        );
      }
    }),
  );
};

export { saveDocumentsEpic };

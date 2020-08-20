import { filter, mapTo, switchMap, tap } from 'rxjs/operators';
import { concat, defer, from, Observable, of } from 'rxjs';
import { ofType } from 'deox';
import { Actions } from '../../actions.types';
import { SaveOperationState } from '::store/epics/save-documents/helpers/save-document/helpers/save-deleted-nodes';
import { createErrorHandler } from '../shared/create-error-handler';
import { createTimeoutHandler } from '../shared/create-timeout-handler';
import { saveDocuments } from '::store/epics/save-documents/helpers/save-document/save-documents';
import { ac, store } from '../../store';
import { redirectToNewDocumentId$ } from '::store/epics/save-documents/helpers/redirect-to-new-document-id$';
import { createSaveState } from '::store/epics/save-documents/helpers/save-document/helpers/shared';
import { resetCache } from '::store/epics/save-documents/helpers/reset-cache';
import { cacheCurrentNode } from '::store/epics/save-documents/helpers/cache-current-node';
import { Epic } from 'redux-observable';
import { swapPersistedTreeDocumentIds } from '::store/epics/save-documents/helpers/swap-persisted-tree-document-ids';
import { SnackbarMessages } from '::root/components/shared-components/snackbar/snackbar-messages';

const saveDocumentsEpic: Epic = (action$: Observable<Actions>) => {
  return action$.pipe(
    ofType([ac.__.document.save]),
    filter(() => store.getState().document.asyncOperations.save === 'idle'),
    switchMap(() => {
      const saveFulfilled$ = of(ac.__.document.saveFulfilled()).pipe(
        tap(() => {
          ac.dialogs.setSnackbar(SnackbarMessages.documentSaved);
        }),
      );
      const state: SaveOperationState = createSaveState();
      const savePending$ = of(ac.__.document.savePending());
      const cacheCurrentNode$ = defer(() =>
        of(cacheCurrentNode()).pipe(mapTo(ac.__.document.nodeCached())),
      );
      const saveInProgress$ = of(ac.__.document.saveInProgress());
      const saveDocuments$ = defer(() =>
        from(saveDocuments(state)).pipe(
          tap(resetCache),
          tap(swapPersistedTreeDocumentIds),
          mapTo(ac.__.document.cacheReset()),
        ),
      );
      const maybeRedirectToNewDocument$ = defer(() =>
        redirectToNewDocumentId$(state),
      );
      return concat(
        savePending$,
        cacheCurrentNode$,
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
          actionCreators: [ac.__.document.saveFailed],
        }),
      );
    }),
  );
};

export { saveDocumentsEpic };

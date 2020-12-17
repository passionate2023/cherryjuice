import { filter, mapTo, mergeMap, take, tap } from 'rxjs/operators';
import { concat, defer, from, Observable, of } from 'rxjs';
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
import { alerts } from '::helpers/texts/alerts';

const saveDocument$ = () => {
  const state: SaveOperationState = createSaveState();
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
    const saveFulfilled$ = concat(
      of(ac_.document.setSwappedIds(state.swappedDocumentIds)),
      of(ac_.document.saveFulfilled()),
    ).pipe(
      tap(() => {
        ac.dialogs.setSnackbar(SnackbarMessages.documentSaved);
      }),
    );

    return concat(saveInProgress$, saveDocuments$, saveFulfilled$).pipe(
      createTimeoutHandler({
        alertDetails: {
          title: 'Saving is taking longer then expected',
          description: alerts.tryRefreshingThePage,
        },
        due: 5 * 60000,
      }),
      createErrorHandler({
        alertDetails: {
          title: 'Could not save',
          description: alerts.somethingWentWrong,
        },
        actionCreators: [ac_.document.saveFailed],
      }),
    );
  }
};

export const cacheDocuments$ = (action$: Observable<Actions>) => {
  return concat(
    of(ac_.documentCache.cachePages()),
    action$.pipe(ofType([ac_.documentCache.cachingPagesFulfilled]), take(1)),
  );
};
const saveDocumentsEpic: Epic = (action$: Observable<Actions>) => {
  return action$.pipe(
    ofType([ac_.document.save]),
    filter(() => store.getState().document.asyncOperations.save === 'idle'),
    mergeMap(() => concat(cacheDocuments$(action$), defer(saveDocument$))),
  );
};

export { saveDocumentsEpic };

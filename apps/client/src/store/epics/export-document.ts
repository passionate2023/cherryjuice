import { concat, defer, Observable, of } from 'rxjs';
import { Actions } from '../actions.types';
import { ac_, store } from '../store';
import { map, switchMap, take } from 'rxjs/operators';
import { ofType } from 'deox';
import { gqlMutation$ } from './shared/gql-query';
import { createErrorHandler } from './shared/create-error-handler';
import { EXPORT_DOCUMENT } from '::graphql/queries/export-document';
import { alerts } from '::helpers/texts/alerts';

export const saveDocument$ = (action$: Observable<Actions>) => {
  const save$ = of(ac_.document.save());
  const waitForSave$ = action$.pipe(
    ofType([ac_.document.saveFulfilled, ac_.document.nothingToSave]),
    take(1),
  );
  return concat(save$, waitForSave$);
};
const exportDocument$ = (documentId: string) => {
  const swappedIds = store.getState().document.swappedIds;
  return gqlMutation$(
    EXPORT_DOCUMENT({
      file_id: swappedIds[documentId] || documentId,
    }),
  ).pipe(map(ac_.document.exportFulfilled));
};

const exportDocumentEpic = (action$: Observable<Actions>) => {
  return action$.pipe(
    ofType([ac_.document.export]),
    switchMap(action => {
      return concat(
        saveDocument$(action$),
        defer(() => exportDocument$(action['payload'])),
      ).pipe(
        createErrorHandler({
          alertDetails: {
            title: 'Could not export the document',
            description: alerts.somethingWentWrong,
          },
        }),
      );
    }),
  );
};
export { exportDocumentEpic };

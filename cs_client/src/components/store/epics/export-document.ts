import { concat, Observable, of } from 'rxjs';
import { Actions } from '../actions.types';
import { ac, store } from '../store';
import { map, switchMap } from 'rxjs/operators';
import { DOCUMENT_MUTATION } from '::graphql/mutations';
import { ofType } from 'deox';
import { gqlMutation } from './shared/gql-query';
import { createErrorHandler } from './shared/create-error-handler';

const exportDocumentEpic = (action$: Observable<Actions>) => {
  const selectedDocumentId = () => store.getState().document.documentId;
  return action$.pipe(
    ofType([ac.__.document.export]),

    switchMap(() => {
      const save = of(ac.__.document.save());
      return concat(
        save,
        action$.pipe(
          ofType([ac.__.document.saveFulfilled]),
          switchMap(() => {
            return gqlMutation({
              ...DOCUMENT_MUTATION.exportDocument,
              variables: { file_id: selectedDocumentId() },
            }).pipe(map(ac.__.document.exportFulfilled));
          }),
        ),
      ).pipe(
        createErrorHandler({
          alertDetails: {
            title: 'Could not export',
            description: 'Check your network connection',
          },
        }),
      );
    }),
  );
};
export { exportDocumentEpic };

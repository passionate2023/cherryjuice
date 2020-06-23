import { Observable, concat, of, defer } from 'rxjs';
import { Actions } from '../actions.types';
import { ac, store } from '../store';
import { switchMap, ignoreElements, map } from 'rxjs/operators';
import { DOCUMENT_MUTATION } from '::graphql/mutations';
import { ofType } from 'deox';
import { gqlMutation } from './shared/gql-query';
import { createErrorHandler } from './shared/create-error-handler';
import { uri } from '::graphql/apollo';

const triggerDownload = filename => res =>
  res.blob().then(b => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(b);
    a.setAttribute('download', filename);
    a.click();
  });

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
            const exportDocument = defer(() =>
              gqlMutation({
                ...DOCUMENT_MUTATION.exportDocument,
                variables: { file_id: selectedDocumentId() },
              }),
            ).pipe(
              map(documentName => {
                const token = localStorage.getItem('cs.user.token');
                fetch(`${uri.httpBase}/exports/${documentName}`, {
                  headers: {
                    authorization: `bearer ${token}`,
                  },
                }).then(triggerDownload(documentName));
              }),
              ignoreElements(),
              createErrorHandler({
                alertDetails: {
                  title: 'Could not export',
                  description: 'Check your network connection',
                },
              }),
            );
            return exportDocument;
          }),
        ),
      );
    }),
  );
};
export { exportDocumentEpic };

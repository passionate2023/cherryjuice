import { concat, Observable } from 'rxjs';
import { Actions } from '../actions.types';
import { ac_ } from '../store';
import { ignoreElements, switchMap } from 'rxjs/operators';
import { ofType } from 'deox';
import { gqlMutation$ } from './shared/gql-query';
import { createErrorHandler } from './shared/create-error-handler';
import { CLONE_DOCUMENT } from '::graphql/mutations/document/clone-document';
import { saveDocument$ } from '::store/epics/export-document';

const cloneDocument$ = (documentId: string) =>
  gqlMutation$(
    CLONE_DOCUMENT({
      file_id: documentId,
    }),
  ).pipe(ignoreElements());

const cloneDocumentEpic = (action$: Observable<Actions>) => {
  return action$.pipe(
    ofType([ac_.document.clone]),

    switchMap(action => {
      return concat(
        saveDocument$(action$),
        cloneDocument$(action['payload']),
      ).pipe(
        createErrorHandler({
          alertDetails: {
            title: 'Could not clone',
            description: 'Check your network connection',
          },
        }),
      );
    }),
  );
};
export { cloneDocumentEpic };

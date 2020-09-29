import { Observable } from 'rxjs';
import { Actions } from '../actions.types';
import { ac_ } from '../store';
import { ignoreElements, switchMap } from 'rxjs/operators';
import { ofType } from 'deox';
import { gqlMutation } from './shared/gql-query';
import { createErrorHandler } from './shared/create-error-handler';
import { CLONE_DOCUMENT } from '::graphql/mutations/document/clone-document';

const cloneDocumentEpic = (action$: Observable<Actions>) => {
  return action$.pipe(
    ofType([ac_.document.clone]),

    switchMap(action => {
      return gqlMutation(
        CLONE_DOCUMENT({
          file_id: action['payload'],
        }),
      ).pipe(
        ignoreElements(),
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

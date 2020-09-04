import { combineEpics } from 'redux-observable';
import { Observable } from 'rxjs';

const createRootEpic = async (): Promise<(action$) => Observable<unknown>> => {
  const { fetchDocumentEpic } = await import('./fetch-document/fetch-document');
  const { saveDocumentsEpic } = await import('./save-documents/save-documents');
  const { searchNodesEpic } = await import('./search/search-nodes');
  const { exportDocumentEpic } = await import('./export-document');
  const { fetchDocumentsListEpic } = await import('./fetch-documents-list');
  const { deleteDocumentsEpic } = await import(
    './delete-documents/delete-documents'
  );
  const { saveSettingsEpic } = await import('./settings/save-settings');
  const { authEpic } = await import('./auth/auth');
  const { deleteAccountEpic } = await import('./delete-account/delete-account');
  const { fetchNodeEpic } = await import('./fetch-node/fetch-node');
  const { routerEpic } = await import('./router/router');

  return action$ =>
    combineEpics(
      saveSettingsEpic,
      deleteDocumentsEpic,
      authEpic,
      fetchDocumentEpic,
      saveDocumentsEpic,
      fetchDocumentsListEpic,
      exportDocumentEpic,
      searchNodesEpic,
      deleteAccountEpic,
      fetchNodeEpic,
      routerEpic,
    )(action$);
};
export { createRootEpic };

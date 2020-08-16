import { combineEpics } from 'redux-observable';
import { Observable } from 'rxjs';

const createRootEpic = async (): Promise<(action$) => Observable<unknown>> => {
  const { fetchNodesEpic } = await import('./fetch-nodes');
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

  return action$ =>
    combineEpics(
      saveSettingsEpic,
      deleteDocumentsEpic,
      authEpic,
      fetchNodesEpic,
      saveDocumentsEpic,
      fetchDocumentsListEpic,
      exportDocumentEpic,
      searchNodesEpic,
      deleteAccountEpic,
    )(action$);
};
export { createRootEpic };

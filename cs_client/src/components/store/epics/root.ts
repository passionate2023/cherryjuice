import { combineEpics } from 'redux-observable';
import { Observable } from 'rxjs';

const createRootEpic = async (): Promise<(action$) => Observable<unknown>> => {
  const { fetchNodesEpic } = await import('::root/store/epics/fetch-nodes');
  const { saveEpic } = await import('::root/store/epics/save');
  const { searchNodesEpic } = await import(
    '::root/store/epics/search/search-nodes'
  );
  const { exportDocumentEpic } = await import(
    '::root/store/epics/export-document'
  );
  const { fetchDocumentsListEpic } = await import(
    '::root/store/epics/fetch-documents-list'
  );
  const { deleteDocumentsEpic } = await import(
    '::root/store/epics/delete-documents/delete-documents'
  );
  const { saveSettingsEpic } = await import(
    '::root/store/epics/settings/save-settings'
  );
  const { authEpic } = await import('::root/store/epics/auth/auth');
  const { deleteAccountEpic } = await import(
    '::root/store/epics/delete-account/delete-account'
  );

  return action$ =>
    combineEpics(
      saveSettingsEpic,
      deleteDocumentsEpic,
      authEpic,
      fetchNodesEpic,
      saveEpic,
      fetchDocumentsListEpic,
      exportDocumentEpic,
      searchNodesEpic,
      deleteAccountEpic,
    )(action$);
};
export { createRootEpic };

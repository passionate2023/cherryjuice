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
  const { authEpic } = await import('::root/store/epics/auth/auth');
  return action$ =>
    combineEpics(
      authEpic,
      fetchNodesEpic,
      saveEpic,
      fetchDocumentsListEpic,
      exportDocumentEpic,
      searchNodesEpic,
    )(action$);
};
export { createRootEpic };

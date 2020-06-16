import { combineEpics } from 'redux-observable';
import { Observable } from 'rxjs';

const createRootEpic = async (): Promise<(action$) => Observable<unknown>> => {
  const { fetchNodesEpic } = await import('::root/store/epics/fetch-nodes');
  const { saveEpic } = await import('::root/store/epics/save');
  const { fetchDocumentsListEpic } = await import(
    '::root/store/epics/fetch-documents-list'
  );
  return action$ =>
    combineEpics(fetchNodesEpic, saveEpic, fetchDocumentsListEpic)(action$);
};
export { createRootEpic };

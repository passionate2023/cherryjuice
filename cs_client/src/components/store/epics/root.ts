import { combineEpics } from 'redux-observable';
import { Observable } from 'rxjs';

const createRootEpic = async (): Promise<(action$) => Observable<unknown>> => {
  const { fetchNodesEpic } = await import('::root/store/epics/fetch-nodes');
  const { saveEpic } = await import('::root/store/epics/save');
  return action$ => combineEpics(fetchNodesEpic, saveEpic)(action$);
};
export { createRootEpic };

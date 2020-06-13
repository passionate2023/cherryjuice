import { combineEpics } from 'redux-observable';
import { fetchNodesEpic } from '::root/store/epics/fetch-nodes';
import { saveEpic } from '::root/store/epics/save';

const rootEpic = action$ => combineEpics(fetchNodesEpic, saveEpic)(action$);
export { rootEpic };

import { combineEpics } from 'redux-observable';
import { fetchNodesEpic } from '::root/store/epics/fetch-nodes';
import { saveEpic } from '::root/store/epics/save';
import { fetchHtmlEpic } from '::root/store/epics/fetch-html';

const rootEpic = action$ =>
  combineEpics(fetchNodesEpic, saveEpic, fetchHtmlEpic)(action$);
export { rootEpic };

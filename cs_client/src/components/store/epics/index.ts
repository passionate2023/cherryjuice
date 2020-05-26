import { combineEpics } from 'redux-observable';
import { catchError } from 'rxjs/operators';
import { fetchNodesEpic } from '::root/store/epics/fetch-nodes';
import { saveEpic } from '::root/store/epics/save';

const rootEpic = action$ =>
  combineEpics(
    fetchNodesEpic,
    saveEpic,
  )(action$).pipe(
    catchError((error, source) => {
      return source;
    }),
  );
export { rootEpic };

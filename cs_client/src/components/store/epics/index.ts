import { combineEpics } from 'redux-observable';
import { catchError } from 'rxjs/operators';
import { fetchNodesEpic } from '::root/store/epics/fetch-nodes';

const rootEpic = action$ =>
  combineEpics(fetchNodesEpic)(action$).pipe(
    catchError((error, source) => {
      return source;
    }),
  );
export { rootEpic };

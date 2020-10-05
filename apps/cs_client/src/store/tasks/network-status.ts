import { from, interval } from 'rxjs';
import { distinctUntilChanged, flatMap, tap } from 'rxjs/operators';
import { uri } from '::graphql/client/hooks/apollo-client';
import { ac } from '::store/store';

const checkHealth = async (): Promise<boolean> => {
  let success = true;
  await fetch(uri.httpBase + '/ping').catch(() => {
    success = false;
  });
  return success;
};

export const networkStatus = (intervalMs = 5000) => {
  return interval(intervalMs)
    .pipe(
      flatMap(() => from(checkHealth())),
      distinctUntilChanged(),
      tap(online => {
        ac.root.setNetworkStatus(online);
      }),
    )
    .subscribe();
};

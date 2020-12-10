import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { interval } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';
import { smoothScrollIntoView } from '@cherryjuice/shared-helpers';

export const useScrollToHash = () => {
  const history = useHistory();
  useEffect(() => {
    if (history.location.hash) {
      const subscribable = interval(100)
        .pipe(
          map(() =>
            document.getElementById(decodeURIComponent(history.location.hash)),
          ),
          take(5),
          filter(Boolean),
          take(1),
          tap(anchor => {
            smoothScrollIntoView(anchor as HTMLElement);
          }),
        )
        .subscribe();
      return () => {
        subscribable.unsubscribe();
      };
    }
  }, [history.location.hash]);
};

import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { scrollIntoToolbar } from '::helpers/ui';
import { interval } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';
import { smoothScrollIntoView } from '::root/components/app/components/editor/document/components/title-and-recent-nodes/components/components/tab';

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
            scrollIntoToolbar();
          }),
        )
        .subscribe();
      return () => {
        subscribable.unsubscribe();
      };
    }
  }, [history.location.hash]);
};

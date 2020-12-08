import { MutableRefObject } from 'react';
import { interval } from 'rxjs';
import { distinctUntilChanged, filter, map, take, tap } from 'rxjs/operators';
export type Props = {
  elementRef: MutableRefObject<HTMLElement>;
  onEntered: () => void;
  onExited: () => void;
};

export const onEnteredViewPort = ({
  elementRef,
  onEntered,
  onExited,
}: Props) => {
  const xy$ = interval(250).pipe(
    map(() => +elementRef.current.getBoundingClientRect().bottom.toFixed()),
    distinctUntilChanged(),
    filter(a => window.innerHeight - a > 0),
    take(1),
    tap(onScreen => {
      if (onScreen) onEntered();
      else onExited();
    }),
  );
  const subscription = xy$.subscribe();
  return () => {
    subscription.unsubscribe();
  };
};

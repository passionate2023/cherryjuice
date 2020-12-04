import { MutableRefObject } from 'react';
import { interval } from 'rxjs';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
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
    map(a => window.innerHeight - a <= 0),
    distinctUntilChanged(),
    tap(offScreen => {
      if (!offScreen) onEntered();
      else onExited();
    }),
  );
  const subscription = xy$.subscribe();
  return () => {
    subscription.unsubscribe();
  };
};

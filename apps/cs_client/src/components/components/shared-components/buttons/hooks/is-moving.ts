import { MutableRefObject } from 'react';
import { interval } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  pairwise,
  tap,
} from 'rxjs/operators';
export type Props = {
  elementRef: MutableRefObject<HTMLElement>;
  onArrived: () => void;
  onStartingToGo: () => void;
  comesFromUp?: boolean;
};

export const isMoving$ = ({
  elementRef,
  onArrived,
  onStartingToGo,
  comesFromUp,
}: Props) => {
  const xy$ = interval(100).pipe(
    map(() => +elementRef.current.getBoundingClientRect().top.toFixed()),
    distinctUntilChanged(),
    pairwise(),
    filter(([a, b]) => Math.abs(b - a) < 2),
    map(([a, b]) => b - a < 0),
    distinctUntilChanged(),
    tap(arrived => {
      if (comesFromUp) arrived = !arrived;
      if (arrived) onArrived();
      else onStartingToGo();
    }),
  );

  const subscription = xy$.subscribe();
  return () => {
    subscription.unsubscribe();
  };
};

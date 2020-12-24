import { MutableRefObject } from 'react';
import { interval } from 'rxjs';
import { distinctUntilChanged, filter, map, take, tap } from 'rxjs/operators';
export type Props = {
  elementRef: MutableRefObject<HTMLElement>;
  onEntered: () => void;
};

const isInsideWindow = a => window.innerHeight - a > 0;

export const onEnteredViewPort = ({ elementRef, onEntered }: Props) => {
  const xy$ = interval(250).pipe(
    map(() => +elementRef.current.getBoundingClientRect().bottom.toFixed()),
    distinctUntilChanged(),
    filter(isInsideWindow),
    take(1),
    tap(onEntered),
  );
  const subscription = xy$.subscribe();
  return () => {
    subscription.unsubscribe();
  };
};

import { concat, Observable } from 'rxjs';

export const progressify = <T>(
  propsArray: T[],
  action: (T) => Observable<any>,
  onProgress: (number) => Observable<any>,
) => {
  const state = {
    totalProps: propsArray.length,
    count: 0,
  };
  return concat(
    ...propsArray.map(prop =>
      concat(action(prop), onProgress(++state.count / state.totalProps)),
    ),
  );
};

// https://stackoverflow.com/a/44687374/14193895
export const unFlatMap = (lengthOfSubArrays = 100) => <T>(xs: T[]): T[][] =>
  new Array(Math.ceil(xs.length / lengthOfSubArrays))
    .fill(undefined)
    .map((_, i) =>
      xs.slice(i * lengthOfSubArrays, (i + 1) * lengthOfSubArrays),
    );

export const removeDuplicates = <T>(array: T[]): T[] =>
  Array.from(new Set(array));

export enum Direction {
  up = 'up',
  down = 'down',
  bottom = 'bottom',
  top = 'top',
}

export const move = <T>(arr: T[], el: T, direction: Direction): T[] => {
  const currentIndex = arr.indexOf(el);
  let newIndex: number;
  if (direction === Direction.bottom) {
    newIndex = arr.length - 1;
  } else {
    if (direction === Direction.top) {
      newIndex = 0;
    } else {
      newIndex =
        direction === Direction.up ? currentIndex - 1 : currentIndex + 1;
    }
  }
  if (newIndex >= arr.length || newIndex < 0) return arr;
  const newArr = arr.slice();
  newArr.splice(currentIndex, 1);
  newArr.splice(newIndex, 0, el);
  return newArr;
};

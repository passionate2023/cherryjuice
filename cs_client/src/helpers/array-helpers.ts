// https://stackoverflow.com/a/44687374/14193895
export const unFlatMap = (lengthOfSubArrays = 100) => <T>(xs: T[]): T[][] =>
  new Array(Math.ceil(xs.length / lengthOfSubArrays))
    .fill(undefined)
    .map((_, i) =>
      xs.slice(i * lengthOfSubArrays, (i + 1) * lengthOfSubArrays),
    );
export const removeDuplicates = <T>(array: T[]): T[] =>
  Array.from(new Set(array));

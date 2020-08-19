export const reverseFlatMap = (lengthOfSubArrays = 100) => <T>(
  res: T[][] = [],
) => (xs: T[]): T[][] => {
  if (xs.length <= 100) {
    if (res.push(xs)) return res;
  } else {
    res.push(xs.splice(0, lengthOfSubArrays));
    return reverseFlatMap(lengthOfSubArrays)(res)(xs);
  }
};

export const removeDuplicates = <T>(array: T[]): T[] =>
  Array.from(new Set(array));

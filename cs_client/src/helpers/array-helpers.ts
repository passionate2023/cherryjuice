export const unFlatMap = (lengthOfSubArrays = 100) => <T>(res: T[][] = []) => (
  xs: T[],
): T[][] => {
  if (xs.length <= 100) {
    if (res.push(xs)) return res;
  } else {
    res.push(xs.splice(0, lengthOfSubArrays));
    return unFlatMap(lengthOfSubArrays)(res)(xs);
  }
};

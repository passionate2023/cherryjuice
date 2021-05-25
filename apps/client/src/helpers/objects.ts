export const cloneObj = <T>(ogObj: T): typeof ogObj =>
  JSON.parse(JSON.stringify(ogObj));

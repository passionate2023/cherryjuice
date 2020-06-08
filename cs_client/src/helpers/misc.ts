const insertAt = xs => index => (x: any): void => xs.splice(index, 0, x);
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
  } catch {
    return false;
  }

  return true;
};
export { insertAt, isValidUrl };

export const stringToSingleElement = (singleElement: string): Element =>
  // https://stackoverflow.com/a/42448876
  new DOMParser().parseFromString(singleElement, 'text/html').body.children[0];

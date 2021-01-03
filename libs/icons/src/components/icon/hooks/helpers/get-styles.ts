const snakeToCamel = str =>
  str
    .toLowerCase()
    .replace(/([-_][a-z])/g, group =>
      group.toUpperCase().replace('-', '').replace('_', ''),
    );
// todo: move to shared lib
const regex = /([\w-]*)\s*:\s*([^;]*)/g;
export const getStyles = el => {
  const cssText = typeof el === 'string' ? el : el?.style?.cssText;
  if (!cssText) {
    return {};
  }
  const properties = {};
  let match;
  // eslint-disable-next-line no-cond-assign
  while ((match = regex.exec(cssText)))
    properties[snakeToCamel(match[1])] = match[2].trim();
  return properties;
};

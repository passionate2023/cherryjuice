const mergeableStringProperties = ['text-decoration'];
const concatenateStringProperties = ({ objectA, objectB }) => {
  Object.entries(objectB).forEach(([k, v]) => {
    if (
      typeof objectA[k] === 'string' &&
      typeof v === 'string' &&
      mergeableStringProperties.includes(k)
    ) {
      objectA[k] += ` ${v}`;
    } else objectA[k] = v;
  });
  return objectA;
};
const mergeObjectProperties = ({ objectA, objectB }) => {
  Object.entries(objectB).forEach(([key, value]) => {
    if (typeof objectA[key] === 'object' && typeof value === 'object') {
      objectA[key] =
        key === 'style'
          ? concatenateStringProperties({
              objectA: objectA[key],
              objectB: value,
            })
          : { ...objectA[key], ...value };
    } else {
      objectA[key] = value;
    }
  });
  return objectA;
};
const hoistAHtmlProperties = ({ tags }) =>
  tags.reduce(
    (acc, val, i) => {
      acc.attributes = mergeObjectProperties({
        objectA: acc.attributes,
        objectB: val[1],
      });
      acc.tags.push([val[0], i === tags.length - 1 ? acc.attributes : {}]);
      return acc;
    },
    { tags: [], attributes: {} },
  ).tags;

export { hoistAHtmlProperties };

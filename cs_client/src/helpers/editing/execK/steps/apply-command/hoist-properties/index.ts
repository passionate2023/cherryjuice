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
const whiteListedTags = {
  img: () => true,
  table: () => true,
  code: attributes => attributes.class?.includes('rich-text__code'),
  a: () => true,
};
const isTagWhiteListed = ({ tagName, attributes }) =>
  whiteListedTags[tagName] && whiteListedTags[tagName](attributes);
const hoistAHtmlProperties = ({ tags }) =>
  tags.reduce(
    (acc, val, i) => {
      const hoistAllAttributes = !isTagWhiteListed({
        tagName: val[0],
        attributes: val[1],
      });
      if (hoistAllAttributes) {
        acc.attributes = mergeObjectProperties({
          objectA: acc.attributes,
          objectB: val[1],
        });
        acc.tags.push([val[0], i === tags.length - 1 ? acc.attributes : {}]);
      } else {
        const hoistStyle = val[1].style && i < tags.length - 1;
        if (hoistStyle) {
          acc.attributes = mergeObjectProperties({
            objectA: acc.attributes,
            objectB: { style: val[1].style },
          });
          delete val[1].style;
        }
        acc.tags.push(val);
      }
      return acc;
    },
    { tags: [], attributes: {} },
  ).tags;

export { hoistAHtmlProperties };

const hoistAHtmlProperties = ({ tags }) =>
  tags.reduce(
    (acc, val, i) => {
      const currentTagAttributes = Object.entries(val[1]);
      currentTagAttributes.forEach(([key, value]) => {
        if (
          typeof acc.attributes[key] === 'object' &&
          typeof value === 'object'
        )
          acc.attributes[key] = {
            ...value,
            ...acc.attributes[key],
          };
        else {
          acc.attributes[key] = value;
        }
      });
      acc.tags.push([val[0], i === tags.length - 1 ? acc.attributes : {}]);
      return acc;
    },
    { tags: [], attributes: {} },
  ).tags;

export { hoistAHtmlProperties };

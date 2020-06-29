const copyProperties = (FROM, TO, excludedProperties) => {
  Object.entries(FROM).forEach(([key, value]) => {
    if (!excludedProperties[key]) TO[key] = value;
  });
};
export { copyProperties };

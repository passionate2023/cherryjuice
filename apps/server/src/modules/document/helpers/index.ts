const copyProperties = (FROM, TO, excludedProperties: string[]) => {
  const _excludedProperties = new Set(excludedProperties);
  Object.entries(FROM).forEach(([key, value]) => {
    if (!_excludedProperties.has(key)) TO[key] = value;
  });
};
export { copyProperties };

const headers = Array.from({ length: 6 }).map((_, i) => `h${i + 1}`);

export const addEmptyLineBeforeHeader = (acc, val) => {
  const isHeader =
    typeof val === 'object' &&
    val.tags.some(([tagName]) => headers.includes(tagName));
  const isDefinitionDefinition =
    typeof val === 'object' && val.tags.some(([tagName]) => 'dd' === tagName);
  const isDefinitionTitle =
    typeof val === 'object' && val.tags.some(([tagName]) => 'dt' === tagName);
  if (isHeader) {
    acc.push('\n', val);
  } else if (isDefinitionDefinition) {
    // eslint-disable-next-line no-useless-escape
    val._ = `\&nbsp; &nbsp; ${val._ || ''}`;
    acc.push('\n', val);
  } else if (isDefinitionTitle) {
    acc.push('\n', val);
  } else {
    acc.push(val);
  }
  return acc;
};

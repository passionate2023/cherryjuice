const removeFormatting = ({ aHtmlElement, lineStyle }) => {
  aHtmlElement.tags = [['span', {}]];
  lineStyle.deleteAll = true;
};

export { removeFormatting };

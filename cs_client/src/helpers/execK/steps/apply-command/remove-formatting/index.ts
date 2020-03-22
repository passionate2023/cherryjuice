
const removeFormatting = ({ aHtmlElement }) => {
  aHtmlElement.tags = [['span', {}]];
};

export {removeFormatting}

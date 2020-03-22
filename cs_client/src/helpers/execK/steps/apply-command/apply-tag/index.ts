import { calculateTag } from '::helpers/execK/steps/apply-command/apply-tag/calculate-tag';

const mergeStylesWithRootTag = ({ aHtmlElement, tagToBeDeleted }) => {
  if (!aHtmlElement.tags.length) aHtmlElement.tags.push(['span', {}]);
  if (tagToBeDeleted[1].style)
    aHtmlElement.tags[0][1].style = {
      ...tagToBeDeleted[1].style,
      ...(aHtmlElement.tags[0][1].style || {})
    };
};
const applyTag = ({ aHtmlElement, tagExists: remove, tagName }) => {
  // const tagToBeDeleted = aHtmlElement.tags.find(([tag]) => tag === tagName);
  // if (remove) {
  //   if (tagToBeDeleted) {
  //     const indexOfTagToBeDeleted = aHtmlElement.tags.indexOf(tagToBeDeleted);
  //     aHtmlElement.tags.splice(indexOfTagToBeDeleted, 1);
  //     mergeStylesWithRootTag({ aHtmlElement,  tagToBeDeleted });
  //   }
  // } else {
  //   if (!tagToBeDeleted) aHtmlElement.tags.push([tagName, {}]);
  // }
  aHtmlElement.tags = calculateTag({
    cmd: { remove, tagName },
    tags: aHtmlElement.tags
  });
};

export { applyTag };

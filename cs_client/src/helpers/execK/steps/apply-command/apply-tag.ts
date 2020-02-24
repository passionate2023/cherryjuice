const applyTag = ({ aHtmlElement, tagExists, tagName }) => {
  const toBeDeleted = aHtmlElement.tags.find(([tag]) => tag === tagName);
  if (tagExists) {
    if (toBeDeleted) {
      const indexOfTagToBeDeleted = aHtmlElement.tags.indexOf(toBeDeleted);
      aHtmlElement.tags.splice(indexOfTagToBeDeleted, 1);
      // merge styles of the item to be deleted with the top-level tag tag
      if (!aHtmlElement.tags.length) aHtmlElement.tags.push(['span', {}]);
      if (toBeDeleted[1].style)
        aHtmlElement.tags[0][1].style =
          toBeDeleted[1].style + (aHtmlElement.tags[0][1].style || '');
    }
  } else {
    if (!toBeDeleted) aHtmlElement.tags.push([tagName, {}]);
  }
};

export { applyTag };

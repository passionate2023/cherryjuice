const extractImage = (acc, el, commonAttributes, options, state) => {
  if (el.dataset.href) state.selectionContainsLinks = true;
  if (el.dataset)
    // existing image
    acc.push(
      options.serializeNonTextElements
        ? {
            ...commonAttributes,
            type: 'png',
            outerHTML: el.outerHTML,
          }
        : {
            type: 'png',
            other_attributes: {
              ...(el.dataset.link && {
                link: decodeURIComponent(el.dataset.link),
              }),
            },
            style: {
              width: /(^\d+)/.exec(el.style.width)[1],
              height: /(^\d+)/.exec(el.style.height)[1],
            },
          },
    );
  // new image
  else {
    throw new Error('saving pasted images is not implemented yet');
  }
};
export { extractImage };

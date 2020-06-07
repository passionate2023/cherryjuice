const extractImage = (acc, el, commonAttributes, options, state) => {
  if (el.dataset) {
    if (el.dataset.href) state.selectionContainsLinks = true;
    if (el.dataset.id) state.imageIDs.add(el.dataset.id);
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
              ...(el.dataset.id && {
                id: options?.swappedImageIds && options.swappedImageIds[el.dataset.id]
                  ? options.swappedImageIds[el.dataset.id]
                  : el.dataset.id,
              }),
            },
            style: {
              width: el.style.width,
              height: el.style.height,
            },
          },
    );
  }
  // new image
  else {
    throw new Error('saving pasted images is not implemented yet');
  }
};
export { extractImage };

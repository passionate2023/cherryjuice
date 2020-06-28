import { GetAhtmlOptions } from '..';

const extractImage = (
  acc,
  el,
  commonAttributes,
  options: GetAhtmlOptions,
  state,
) => {
  if (options.removeAttributes) {
    const img = document.createElement('img');
    img.src = el.src;
    if (el.style.width) img.style.width = el.style.width;
    if (el.style.height) img.style.height = el.style.height;
    el = img;
  }
  if (el.dataset.href) state.selectionContainsLinks = true;
  if (el.dataset.id) state.imageIDs.add(el.dataset.id);
  acc.push(
    options.serializeNonTextElements
      ? {
          ...commonAttributes,
          type: 'png',
          outerHTML: el.outerHTML,
        }
      : {
          type: 'png',
          ...(el.dataset.href && {
            linkAttributes: {
              'data-type': el.dataset.type,
              href: decodeURIComponent(el.dataset.href),
              target: el.dataset.target,
            },
          }),
          other_attributes: {
            ...(el.dataset.id && {
              id:
                options?.swappedImageIds &&
                options.swappedImageIds[el.dataset.id]
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
};
export { extractImage };

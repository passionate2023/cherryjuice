const unsetImagesAttributes = (images: HTMLImageElement[]) => {
  const imageAttributesTempContainer = [];
  images.forEach(img => {
    imageAttributesTempContainer.push({
      src: img.getAttribute('src'),
      dataId: img.getAttribute('data-id'),
    });
    img.setAttribute('src', '');
    img.removeAttribute('data-id');
  });
  return imageAttributesTempContainer;
};
const setImageAttributes = (images, attributes) => {
  images.forEach((img, i) => {
    img.setAttribute('src', attributes[i].src);
    img.setAttribute('data-id', attributes[i].dataId);
  });
};
const getEditorContentWithoutImages = () => {
  let html, id, node_id, edited;
  const editor: HTMLDivElement = document.querySelector('#rich-text');
  let imageAttributesTempContainer: any[] = [];
  if (editor) {
    const images = Array.from(
      editor.querySelectorAll('img.rich-text__image'),
    ) as HTMLImageElement[];
    imageAttributesTempContainer = unsetImagesAttributes(images);
    html = editor.innerHTML;
    id = editor.dataset.id;
    edited = editor.dataset.edited;
    node_id = editor.dataset.node_id;
    setImageAttributes(images, imageAttributesTempContainer);
  }
  return {
    html,
    id,
    node_id,
    edited,
    imageIDs: Object.fromEntries(
      imageAttributesTempContainer.map(({ dataId }) => [dataId, true]),
    ),
  };
};
const getNodeImageIDsFromCache = ({ cache, nodeId }): string[] => {
  return cache.data.get('Node:' + nodeId)[
    // eslint-disable-next-line no-unexpected-multiline
    'image({"thumbnail":true})'
  ].map(({ id }) => /:(.+)$/.exec(id)[1]);
};

const updatedCachedHtml = (cache, nodeId, html) => {
  const node = cache.data.get('Node:' + nodeId);
  // @ts-ignore
  cache.data.set('Node:' + nodeId, {
    // @ts-ignore
    ...node,
    html,
  });
};
const updatedCachedMeta = ({cache, nodeId, meta}) => {
  // @ts-ignore
  const node = cache.data.get('Node:' + nodeId);
  // @ts-ignore
  cache.data.set('Node:' + nodeId, {
    // @ts-ignore
    ...node,
    ...meta,
  });
};

const updateCachedImages = (cache, nodeId, deletedImages: string[]) => {
  const node = cache.data.get('Node:' + nodeId);
  const deleted = Object.fromEntries(
    deletedImages.map(id => ['Image:' + id, true]),
  );
  cache.data.set('Node:' + nodeId, {
    // @ts-ignore
    ...node,
    'image({"thumbnail":true})': node['image({"thumbnail":true})'].filter(
      ({ id }) => !deleted[id],
    ),
    'image({"thumbnail":false})': node['image({"thumbnail":false})'].filter(
      ({ id }) => !deleted[id],
    ),
  });
  deletedImages.forEach(id => {
    cache.data.delete('Image:' + id);
  });
};
const updateCachedHtmlAndImages = (cache): { deletedImageIDs: string[] } => {
  const {
    html,
    id,
    edited,
    imageIDs: imageIDsInDom,
  } = getEditorContentWithoutImages();
  let deletedImageIDs = [];
  if (edited) {
    const imageIDsInCache = getNodeImageIDsFromCache({ cache, nodeId: id });
    deletedImageIDs = imageIDsInCache.filter(id => !imageIDsInDom[id]);
    updatedCachedHtml(cache, id, html);
    if (deletedImageIDs.length) updateCachedImages(cache, id, deletedImageIDs);
  }
  return { deletedImageIDs };
};
export {
  updateCachedHtmlAndImages,
  getNodeImageIDsFromCache,
  updateCachedImages,
  updatedCachedHtml,
  getEditorContentWithoutImages,
  updatedCachedMeta
};

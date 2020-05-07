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
  let html, id, node_id;
  const editor = document.querySelector('#rich-text');
  let imageAttributesTempContainer: any[] = [];
  if (editor) {
    const images = Array.from(
      editor.querySelectorAll('img.rich-text__image'),
    ) as HTMLImageElement[];
    imageAttributesTempContainer = unsetImagesAttributes(images);
    html = editor.innerHTML;
    // @ts-ignore
    id = editor.dataset.id;
    // @ts-ignore
    node_id = editor.dataset.node_id;
    setImageAttributes(images, imageAttributesTempContainer);
  }
  return {
    html,
    id,
    node_id,
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
const updateCacheAfterSwitchingNode = cache => {
  const { html, id, imageIDs: imageIDsInDom } = getEditorContentWithoutImages();
  if (id) {
    const imageIDsInCache = getNodeImageIDsFromCache({ cache, nodeId: id });
    const deletedImages = imageIDsInCache.filter(id => !imageIDsInDom[id]);
    updatedCachedHtml(cache, id, html);
    if (deletedImages.length) updateCachedImages(cache, id, deletedImages);
  }
};
export {
  updateCacheAfterSwitchingNode,
  getNodeImageIDsFromCache,
  updateCachedImages,
  updatedCachedHtml,
  getEditorContentWithoutImages,
};

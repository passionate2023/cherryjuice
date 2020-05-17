import { apolloCache } from '::graphql/cache-helpers';

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
const getNodeImageIDsFromCache = ({ nodeId }): string[] => {
  return apolloCache.getNode(nodeId)[
    // eslint-disable-next-line no-unexpected-multiline
    'image({"thumbnail":true})'
  ].map(({ id }) => /:(.+)$/.exec(id)[1]);
};

const updatedCachedHtml = ({ nodeId, html }) => {
  const node = apolloCache.getNode(nodeId);
  apolloCache.setNode(nodeId, { ...node, html });
};
const updatedCachedMeta = ({ nodeId, meta }) => {
  const node = apolloCache.getNode(nodeId);
  apolloCache.setNode(nodeId, { ...node, ...meta });
};

const updateCachedImages = ({
  nodeId,
  deletedImages,
}: {
  nodeId;
  deletedImages: string[];
}) => {
  const node = apolloCache.getNode(nodeId);
  const deleted = Object.fromEntries(
    deletedImages.map(id => ['Image:' + id, true]),
  );
  apolloCache.setNode(nodeId, {
    ...node,
    // @ts-ignore
    'image({"thumbnail":true})': node['image({"thumbnail":true})'].filter(
      ({ id }) => !deleted[id],
    ),
    // @ts-ignore
    'image({"thumbnail":false})': node['image({"thumbnail":false})'].filter(
      ({ id }) => !deleted[id],
    ),
  });
  deletedImages.forEach(apolloCache.deleteImage);
};
const updateCachedHtmlAndImages = (): { deletedImageIDs: string[] } => {
  const {
    html,
    id,
    edited,
    imageIDs: imageIDsInDom,
  } = getEditorContentWithoutImages();
  let deletedImageIDs = [];
  if (edited) {
    const imageIDsInCache = getNodeImageIDsFromCache({ nodeId: id });
    deletedImageIDs = imageIDsInCache.filter(id => !imageIDsInDom[id]);
    updatedCachedHtml({ nodeId: id, html });
    if (deletedImageIDs.length)
      updateCachedImages({ nodeId: id, deletedImages: deletedImageIDs });
  }
  return { deletedImageIDs };
};
export {
  updateCachedHtmlAndImages,
  getNodeImageIDsFromCache,
  updateCachedImages,
  updatedCachedHtml,
  getEditorContentWithoutImages,
  updatedCachedMeta,
};

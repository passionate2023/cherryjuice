import { apolloCache } from '::graphql/cache/apollo-cache';

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
  return apolloCache.node.get(nodeId)[
    // eslint-disable-next-line no-unexpected-multiline
    'image({"thumbnail":true})'
  ].map(({ id }) => /:(.+)$/.exec(id)[1]);
};

const updatedCachedHtml = ({ nodeId, html }) => {
  apolloCache.node.mutate({
    nodeId,
    meta: {
      html,
    },
  });
};

const updateCachedImages = ({
  nodeId,
  deletedImages,
}: {
  nodeId;
  deletedImages: string[];
}) => {
  const node = apolloCache.node.get(nodeId);
  const deleted = Object.fromEntries(
    deletedImages.map(id => ['Image:' + id, true]),
  );
  apolloCache.node.mutate({
    nodeId,
    meta: {
      'image({"thumbnail":true})': node['image({"thumbnail":true})'].filter(
        ({ id }) => !deleted[id],
      ),
      'image({"thumbnail":false})': node['image({"thumbnail":false})'].filter(
        ({ id }) => !deleted[id],
      ),
    },
  });
  deletedImages.forEach(apolloCache.image.delete(node.id));
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
};

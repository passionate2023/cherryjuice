import { apolloCache } from '::graphql/cache/apollo-cache';
import { getEditor } from '::app/editor/document/rich-text/hooks/get-node-images';

const unsetImagesAttributes = (images: HTMLImageElement[]) => {
  const imageAttributesTempContainer = [];
  images.forEach(img => {
    imageAttributesTempContainer.push({
      src: img.getAttribute('src'),
      dataId: img.getAttribute('data-id'),
    });
    img.removeAttribute('src');
  });
  return imageAttributesTempContainer;
};
const setImageAttributes = (images, attributes) => {
  images.forEach((img, i) => {
    img.setAttribute('src', attributes[i].src);
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
    imageIDs: imageAttributesTempContainer.map(({ dataId }) => dataId),
  };
};
const getNodeImageIDsFromCache = ({ nodeId }): string[] => {
  return apolloCache.node
    .get(nodeId)
    // eslint-disable-next-line no-unexpected-multiline
    ['image({"thumbnail":true})'].map(({ id }) => /:(.+)$/.exec(id)[1]);
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
  deletedImageIDs,
  newImageIDs,
  imageIDsInDom,
}: {
  nodeId;
  deletedImageIDs: string[];
  newImageIDs: string[];
  imageIDsInDom: string[];
}) => {
  const node = apolloCache.node.get(nodeId);

  const editor = getEditor();
  const newImages = newImageIDs.map(id => {
    const imageInDom: HTMLImageElement = editor.querySelector(
      `img[data-id="${id}"]`,
    );
    return {
      id: imageInDom.getAttribute('data-id'),
      base64: imageInDom.src.substr(22),
      index: imageIDsInDom.indexOf(id),
    };
  });

  deletedImageIDs.forEach(apolloCache.image.delete.hard(node.id));
  newImages.forEach(apolloCache.image.create(node.id));
};
const updateCachedHtmlAndImages = (): void => {
  const {
    html,
    id,
    edited,
    imageIDs: imageIDsInDom,
  } = getEditorContentWithoutImages();

  let deletedImageIDs = [];
  let newImageIDs = [];
  if (edited) {
    const imageIDsInCache = getNodeImageIDsFromCache({ nodeId: id });
    const sets = {
      imageIDsInDom: new Set(imageIDsInDom),
      imageIDsInCache: new Set(imageIDsInCache),
    };
    deletedImageIDs = imageIDsInCache.filter(id => !sets.imageIDsInDom.has(id));
    newImageIDs = imageIDsInDom.filter(id => !sets.imageIDsInCache.has(id));
    updatedCachedHtml({ nodeId: id, html });
    if (deletedImageIDs.length || newImageIDs.length)
      updateCachedImages({
        nodeId: id,
        deletedImageIDs,
        newImageIDs,
        imageIDsInDom,
      });
  }
};
export {
  updateCachedHtmlAndImages,
  getNodeImageIDsFromCache,
  updateCachedImages,
  updatedCachedHtml,
};

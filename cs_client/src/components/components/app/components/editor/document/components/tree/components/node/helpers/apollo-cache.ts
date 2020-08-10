import { apolloCache } from '::graphql/cache/apollo-cache';
import { getEditor } from '::root/components/app/components/editor/document/components/rich-text/hooks/get-node-images';

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
const getImages = () =>
  Array.from(
    document
      .querySelector('#rich-text')
      .querySelectorAll('img.rich-text__image'),
  ) as HTMLImageElement[];
const setImageAttributes = attributes => {
  const images = getImages();

  images.forEach((img, i) => {
    img.setAttribute('src', attributes[i].src);
  });
};
const getEditorContentWithoutImages = () => {
  let html, id, node_id, edited;
  const editor: HTMLDivElement = document.querySelector('#rich-text');
  let imageAttributesTempContainer: any[] = [];
  if (editor) {
    const images = getImages();
    imageAttributesTempContainer = unsetImagesAttributes(images);
    html = editor.innerHTML;
    id = editor.dataset.id;
    edited = editor.dataset.edited;
    node_id = editor.dataset.node_id;
    setImageAttributes(imageAttributesTempContainer);
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
  const newImages = newImageIDs.reduce((acc, id) => {
    const imageInDom: HTMLImageElement = editor.querySelector(
      `img[data-id="${id}"]`,
    );
    if (!imageInDom?.src) throw new Error('image has no src');
    acc.push({
      id: imageInDom.getAttribute('data-id'),
      base64: imageInDom.src.substr(22),
      index: imageIDsInDom.indexOf(id),
    });
    return acc;
  }, []);

  deletedImageIDs.forEach(
    apolloCache.image.delete.hard({
      nodeId: node.id,
      documentId: node.documentId,
    }),
  );
  newImages.forEach(
    apolloCache.image.create({ nodeId: node.id, documentId: node.documentId }),
  );
};
const updateCachedHtmlAndImages = () => {
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
    if (deletedImageIDs.length || newImageIDs.length)
      updateCachedImages({
        nodeId: id,
        deletedImageIDs,
        newImageIDs,
        imageIDsInDom,
      });
    updatedCachedHtml({ nodeId: id, html });
  }
};
export {
  updateCachedHtmlAndImages,
  getNodeImageIDsFromCache,
  updateCachedImages,
  updatedCachedHtml,
};

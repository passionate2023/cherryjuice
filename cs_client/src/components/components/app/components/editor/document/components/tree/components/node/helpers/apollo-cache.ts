import { getEditor } from '::root/components/app/components/editor/document/components/rich-text/hooks/get-node-images';
import { ac, store } from '::store/store';
import { getNode } from '::store/selectors/cache/document/node';
import { getDocuments } from '::store/selectors/cache/document/document';
import { snapBackManager } from '::root/components/app/components/editor/tool-bar/components/groups/main-buttons/undo-redo/undo-redo';

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
  let html, id, node_id, documentId, edited;
  const editor: HTMLDivElement = document.querySelector('#rich-text');
  let imageAttributesTempContainer: any[] = [];
  if (editor) {
    const images = getImages();
    imageAttributesTempContainer = unsetImagesAttributes(images);
    html = editor.innerHTML;
    id = editor.dataset.id;
    edited = editor.dataset.edited;
    documentId = editor.dataset.documentId;
    node_id = editor.dataset.node_id;
    setImageAttributes(imageAttributesTempContainer);
  }
  return {
    html,
    id,
    node_id,
    edited,
    documentId,
    imageIDs: imageAttributesTempContainer.map(({ dataId }) => dataId),
  };
};
const getNodeImageIDsFromCache = ({ node_id, documentId }): string[] => {
  const document = getDocuments(store.getState())[documentId];
  return document.nodes[node_id].image.map(image => image.id);
};

const updatedCachedHtml = ({ node_id, documentId, html }) => {
  ac.documentCache.mutateNodeContent({ node_id, documentId, data: { html } });
};

const updateCachedImages = ({
  node_id,
  documentId,
  deletedImageIDs,
  newImageIDs,
  imageIDsInDom,
}: {
  node_id;
  documentId;
  deletedImageIDs: string[];
  newImageIDs: string[];
  imageIDsInDom: string[];
}) => {
  const node = getNode({ node_id, documentId });

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
  if (deletedImageIDs.length)
    ac.documentCache.mutateNodeContent({
      node_id: node.node_id,
      documentId: node.documentId,
      data: {},
      meta: {
        deletedImages: deletedImageIDs,
      },
    });

  ac.documentCache.mutateNodeContent({
    node_id: node.node_id,
    documentId: node.documentId,
    data: { image: newImages },
  });
};
const updateCachedHtmlAndImages = () => {
  const {
    html,
    edited,
    imageIDs: imageIDsInDom,
    node_id,
    documentId,
  } = getEditorContentWithoutImages();
  let deletedImageIDs = [];
  let newImageIDs = [];
  if (edited) {
    snapBackManager.current.reset();
    const imageIDsInCache = getNodeImageIDsFromCache({ node_id, documentId });
    const sets = {
      imageIDsInDom: new Set(imageIDsInDom),
      imageIDsInCache: new Set(imageIDsInCache),
    };
    deletedImageIDs = imageIDsInCache.filter(id => !sets.imageIDsInDom.has(id));
    newImageIDs = imageIDsInDom.filter(id => !sets.imageIDsInCache.has(id));
    if (deletedImageIDs.length || newImageIDs.length)
      updateCachedImages({
        node_id,
        documentId,
        deletedImageIDs,
        newImageIDs,
        imageIDsInDom,
      });
    updatedCachedHtml({ node_id, documentId, html });
    snapBackManager.current.enable(1000);
  }
};
export {
  updateCachedHtmlAndImages,
  getNodeImageIDsFromCache,
  updateCachedImages,
  updatedCachedHtml,
};

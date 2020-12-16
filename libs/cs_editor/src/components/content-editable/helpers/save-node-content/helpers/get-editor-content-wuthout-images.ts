import { getEditor } from '::helpers/pages-manager/helpers/get-editor';

const getImagesFromDom = () =>
  Array.from(
    getEditor().querySelectorAll('img.rich-text__image'),
  ) as HTMLImageElement[];

const setImageAttributes = attributes => {
  const images = getImagesFromDom();

  images.forEach((img, i) => {
    img.setAttribute('src', attributes[i].src);
  });
};

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

export const getEditorContentWithoutImages = () => {
  let html, nodeId, node_id, documentId;
  const editor = getEditor();
  let imageAttributesTempContainer: any[] = [];
  if (editor) {
    const images = getImagesFromDom();
    imageAttributesTempContainer = unsetImagesAttributes(images);
    html = editor.innerHTML;
    documentId = editor.dataset.documentId;
    nodeId = editor.dataset.nodeId;
    [documentId, node_id] = nodeId ? nodeId.split('/') : [];
    setImageAttributes(imageAttributesTempContainer);
  }
  return {
    html,
    node_id,
    documentId,
    imageIDs: imageAttributesTempContainer.map(({ dataId }) => dataId),
  };
};

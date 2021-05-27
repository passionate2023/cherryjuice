const getImagesFromDom = (editor: HTMLDivElement) =>
  Array.from(
    editor.querySelectorAll('img.rich-text__image'),
  ) as HTMLImageElement[];

const setImageAttributes = (attributes, editor: HTMLDivElement) => {
  const images = getImagesFromDom(editor);

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

export const getEditorContentWithoutImages = (editor: HTMLDivElement) => {
  let html, nodeId, node_id, documentId;
  let imageAttributesTempContainer: any[] = [];
  if (editor) {
    const images = getImagesFromDom(editor);
    imageAttributesTempContainer = unsetImagesAttributes(images);
    html = editor.innerHTML;
    documentId = editor.dataset.documentId;
    nodeId = editor.dataset.nodeId;
    [documentId, node_id] = nodeId ? nodeId.split('/') : [];
    setImageAttributes(imageAttributesTempContainer, editor);
  }
  return {
    html,
    node_id,
    documentId,
    imageIDs: imageAttributesTempContainer.map(({ dataId }) => dataId),
  };
};

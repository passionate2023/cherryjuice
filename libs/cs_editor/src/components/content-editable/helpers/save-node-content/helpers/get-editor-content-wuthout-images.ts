const getImagesFromDom = () =>
  Array.from(
    document
      .querySelector('#rich-text')
      .querySelectorAll('img.rich-text__image'),
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
  let html, node_id, documentId, edited;
  const editor: HTMLDivElement = document.querySelector('#rich-text');
  let imageAttributesTempContainer: any[] = [];
  if (editor) {
    const images = getImagesFromDom();
    imageAttributesTempContainer = unsetImagesAttributes(images);
    html = editor.innerHTML;
    edited = editor.dataset.edited;
    documentId = editor.dataset.documentId;
    node_id = editor.dataset.node_id;
    setImageAttributes(imageAttributesTempContainer);
  }
  return {
    html,
    node_id,
    edited,
    documentId,
    imageIDs: imageAttributesTempContainer.map(({ dataId }) => dataId),
  };
};

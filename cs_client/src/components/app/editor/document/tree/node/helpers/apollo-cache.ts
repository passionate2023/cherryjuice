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
  if (editor) {
    const images = Array.from(editor.querySelectorAll('img'));
    const imageAttributesTempContainer = unsetImagesAttributes(images);
    html = editor.innerHTML;
    // @ts-ignore
    id = editor.dataset.id;
    // @ts-ignore
    node_id = editor.dataset.node_id;
    setImageAttributes(images, imageAttributesTempContainer);
  }
  return { html, id, node_id };
};

const updateCache = cache => {
  const { html, id,  } = getEditorContentWithoutImages();
  // @ts-ignore
  cache.data.set('Node:' + id, {
    // @ts-ignore
    ...cache.data.get('Node:' + id),
    html,
  });
}

export {updateCache}
import { getEditor } from '::root/components/editor/components/content-editable/hooks/attach-images-to-html';
import { ac, store } from '::store/store';
import { getDocuments } from '::store/selectors/cache/document/document';
import { snapBackManager } from '::root/components/app/components/editor/tool-bar/components/groups/main-buttons/undo-redo/undo-redo';
import { MutateNodeContentParams } from '::store/ducks/document-cache/helpers/node/mutate-node-content';

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
  let html, node_id, documentId, edited;
  const editor: HTMLDivElement = document.querySelector('#rich-text');
  let imageAttributesTempContainer: any[] = [];
  if (editor) {
    const images = getImages();
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
const getNodeImageIDsFromCache = ({ node_id, documentId }): string[] => {
  const document = getDocuments(store.getState())[documentId];
  return document.nodes[node_id].image.map(image => image.id);
};

const updateCachedImages = ({
  deletedImageIDs,
  newImageIDs,
  imageIDsInDom,
  mutation,
}: {
  deletedImageIDs: string[];
  newImageIDs: string[];
  imageIDsInDom: string[];
  mutation: MutateNodeContentParams;
}) => {
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
  if (deletedImageIDs.length) mutation.meta.deletedImages = deletedImageIDs;
  mutation.data.image = newImages;
};
const updateCachedHtmlAndImages = () => {
  const editor = getEditor();
  let scrollTop: number, scrollLeft: number;
  if (editor) ({ scrollTop, scrollLeft } = editor);
  const {
    html,
    edited,
    imageIDs: imageIDsInDom,
    node_id,
    documentId,
  } = getEditorContentWithoutImages();
  if (editor)
    ac.documentCache.setScrollPosition({
      node_id,
      documentId,
      position: [scrollLeft, scrollTop],
    });
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
    const mutation: MutateNodeContentParams = {
      node_id,
      documentId,
      data: {
        html,
        image: undefined,
      },
      meta: { deletedImages: undefined },
    };
    if (deletedImageIDs.length || newImageIDs.length) {
      updateCachedImages({
        deletedImageIDs,
        newImageIDs,
        imageIDsInDom,
        mutation,
      });
    }
    ac.documentCache.mutateNodeContent(mutation);
    snapBackManager.current.enable(1000);
  }
};

export { updateCachedHtmlAndImages };

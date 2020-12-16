import { getEditor } from '::helpers/pages-manager/helpers/get-editor';
import { bridge } from '::root/bridge';
import { getEditorContentWithoutImages } from '::root/components/content-editable/helpers/save-node-content/helpers/get-editor-content-wuthout-images';
import { getNewImages } from '::root/components/content-editable/helpers/save-node-content/helpers/get-new-images';
import { snapBackManager } from '::root/snapback-manager';
import { pagesManager } from '::hooks/render-page';

const saveNodeContent = () => {
  snapBackManager.current.disable();
  const editor = getEditor();
  let scrollTop: number, scrollLeft: number;
  if (editor) ({ scrollTop, scrollLeft } = editor);
  const {
    html,
    imageIDs: imageIDsInDom,
    node_id,
    documentId,
  } = getEditorContentWithoutImages();
  if (!node_id) return;
  if (editor)
    bridge.current.setScrollPosition({
      node_id,
      documentId,
      position: [scrollLeft, scrollTop],
    });
  let deletedImageIDs = [];
  let newImageIDs = [];
  const nodeId = documentId + '/' + node_id;
  const currentFrameTS = snapBackManager.getCurrentFrameTS(nodeId);
  if (
    currentFrameTS &&
    currentFrameTS !== pagesManager.pages[nodeId].currentFrameTS
  ) {
    // snapBackManager.current.reset();
    const imageIDsInCache = bridge.current.getNodeImageIDsFromCache({
      node_id,
      documentId,
    });
    const sets = {
      imageIDsInDom: new Set(imageIDsInDom),
      imageIDsInCache: new Set(imageIDsInCache),
    };
    deletedImageIDs = imageIDsInCache.filter(id => !sets.imageIDsInDom.has(id));
    newImageIDs = imageIDsInDom.filter(id => !sets.imageIDsInCache.has(id));
    let newImages;
    if (deletedImageIDs.length || newImageIDs.length) {
      newImages = getNewImages({
        newImageIDs,
        imageIDsInDom,
      });
    }
    pagesManager.setUpdatedContentTs(nodeId, currentFrameTS);
    bridge.current.saveHtml({
      documentId,
      node_id,
      html,
      deletedImages: deletedImageIDs,
      newImages,
    });
  }
  snapBackManager.current.enable(200);
};

export { saveNodeContent };

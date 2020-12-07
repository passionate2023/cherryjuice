import { getEditor } from '::editor/components/content-editable/hooks/attach-images-to-html';
import { snapBackManager } from '::root/components/app/components/editor/tool-bar/components/groups/main-buttons/undo-redo/undo-redo';
import { bridge } from '::editor/bridge';
import { getEditorContentWithoutImages } from '::editor/components/content-editable/helpers/save-node-content/helpers/get-editor-content-wuthout-images';
import { getNewImages } from '::editor/components/content-editable/helpers/save-node-content/helpers/get-new-images';

const saveNodeContent = () => {
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
    bridge.current.setScrollPosition({
      node_id,
      documentId,
      position: [scrollLeft, scrollTop],
    });

  let deletedImageIDs = [];
  let newImageIDs = [];
  if (edited) {
    snapBackManager.current.reset();
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

    bridge.current.saveHtml({
      documentId,
      node_id,
      html,
      deletedImages: deletedImageIDs,
      newImages,
    });
    snapBackManager.current.enable(1000);
  }
};

export { saveNodeContent };

import { getEditorContentWithoutImages } from '::root/components/content-editable/helpers/save-node-content/helpers/get-editor-content-wuthout-images';
import { bridge } from '::root/bridge';
import { getNewImages } from '::root/components/content-editable/helpers/save-node-content/helpers/get-new-images';
import { Page } from '::helpers/pages-manager/helpers/render-page/render-page';

export const cachePage = (page: Page) => {
  const lastSavedFrameTs = page.lastSavedFrameTs;
  const snapBack = page.snapBack;
  snapBack.disable();
  const element = page.element;
  const { scrollTop, scrollLeft } = element;
  const {
    html,
    imageIDs: imageIDsInDom,
    node_id,
    documentId,
  } = getEditorContentWithoutImages(element);
  if (!node_id) return;
  if (
    page.scrollPosition[0] !== scrollLeft ||
    page.scrollPosition[1] !== scrollTop
  )
    bridge.current.setScrollPosition({
      node_id,
      documentId,
      position: [scrollLeft, scrollTop],
    });
  let deletedImageIDs = [];
  let newImageIDs = [];
  const currentFrameTS = snapBack.currentFrameTs || 0;
  if (currentFrameTS !== lastSavedFrameTs) {
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
        editor: element,
      });
    }
    bridge.current.saveHtml({
      documentId,
      node_id,
      html,
      deletedImages: deletedImageIDs,
      newImages,
    });
  }
};

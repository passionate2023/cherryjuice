import {
  getEditor,
  getEditorContainer,
} from '::helpers/pages-manager/helpers/get-editor';
import {
  PageProps,
  createContentEditable,
} from '::helpers/pages-manager/helpers/create-content-editable';
import { createHiddenPagesContainer } from '::helpers/pages-manager/helpers/create-hidden-pages-container';
import { attachPageImages } from '::helpers/pages-manager/helpers/attach-page-images';
import { Image } from '@cherryjuice/graphql-types';
import { ScrollIntoHash } from '::helpers/pages-manager/helpers/scroll-into-hash';
import { OnFrameChange, SnapBack } from '::helpers/snapback/snapback/snapback';
import { getEditorContentWithoutImages } from '::root/components/content-editable/helpers/save-node-content/helpers/get-editor-content-wuthout-images';
import { bridge } from '::root/bridge';
import { getNewImages } from '::root/components/content-editable/helpers/save-node-content/helpers/get-new-images';

export const mutationObserverOptions: MutationObserverInit = {
  attributes: true,
  characterData: true,
  subtree: true,
  childList: true,
  attributeOldValue: true,
  characterDataOldValue: true,
};

const scrollIntoHash = new ScrollIntoHash();

export type ContentEditableProps = PageProps & {
  focusOnUpdate: boolean;
  scrollPosition: [number, number];
  images: Image[];
};
export type PageSelector = (pageId: string) => boolean;
type Page = {
  element: HTMLDivElement;
  snapBack: SnapBack;
  lastSavedFrameTs: number;
};

export class PagesManager {
  pages: {
    [id: string]: Page;
  };
  hiddenPagesContainer: HTMLDivElement;
  private currentNodeId: string;
  current: SnapBack;
  private onFrameChange: OnFrameChange;
  constructor() {
    this.init();
  }
  private init = () => {
    const vault = createHiddenPagesContainer();
    const existingVault = document.body.querySelector(
      '#' + vault.getAttribute('id'),
    );
    if (existingVault) existingVault.remove();
    document.body.appendChild(vault);
    this.hiddenPagesContainer = vault;
    this.pages = {};
  };

  setOnFrameChange(onFrameChange: OnFrameChange): void {
    this.onFrameChange = onFrameChange;
  }

  private hidePage = async () => {
    const page = getEditor();
    if (page) {
      const { nodeId } = page.dataset;
      if (nodeId) {
        this.pages[nodeId].snapBack.disable();
        this.hiddenPagesContainer.appendChild(page);
        this.cachePage(nodeId);
      }
    } else throw new Error('no page is mounted');
  };

  private restorePage = (nodeId: string) => {
    const page = this.pages[nodeId];
    if (page) {
      const editor = getEditorContainer();
      editor.innerHTML = '';
      editor.appendChild(page.element);
    } else throw new Error(`page ${nodeId} not found`);
  };

  render = async ({
    focusOnUpdate,
    scrollPosition,
    nodeId,
    editable,
    html,
    images,
  }: ContentEditableProps) => {
    const editor = getEditorContainer();
    const contentEditable = editor.firstElementChild as HTMLDivElement;
    const renderedNodeId = contentEditable?.dataset?.nodeId;
    const queriedNodeIsCached = this.pages[nodeId]?.element;
    const queriedNodeIsRendered = renderedNodeId === nodeId;
    const somePageIsRendered = !!renderedNodeId;
    if (!(queriedNodeIsRendered && queriedNodeIsCached)) {
      if (somePageIsRendered) this.hidePage();
      if (queriedNodeIsCached) this.restorePage(nodeId);
      else {
        editor.innerHTML = createContentEditable({
          nodeId,
          html,
          editable,
        });
        const element = editor.firstElementChild as HTMLDivElement;
        this.pages[nodeId] = {
          element: element,
          snapBack: new SnapBack(
            nodeId,
            mutationObserverOptions,
            this.onFrameChange,
            element,
          ),
          lastSavedFrameTs: 0,
        };
      }
      this.pages[nodeId].snapBack.enable();
      this.currentNodeId = nodeId;
      this.current = this.pages[nodeId].snapBack;
    }
    attachPageImages(editor, images);
    if (focusOnUpdate) editor.focus();
    if (scrollPosition) editor.scrollTo(...scrollPosition);
    scrollIntoHash.scroll();
  };

  resetPages = (predicate: PageSelector) => {
    const pages = Object.entries(this.pages).filter(([id]) => predicate(id));
    pages.forEach(([id, page]) => {
      page.element.remove();
      delete this.pages[id];
      page.snapBack.reset();
    });
  };

  cachePage = (pageId: string) => {
    const snapBack = this.pages[pageId].snapBack;
    snapBack.disable();
    const element = this.pages[pageId].element;
    const { scrollTop, scrollLeft } = element;
    const {
      html,
      imageIDs: imageIDsInDom,
      node_id,
      documentId,
    } = getEditorContentWithoutImages(element);
    if (!node_id) return;
    if (documentId && node_id)
      bridge.current.setScrollPosition({
        node_id,
        documentId,
        position: [scrollLeft, scrollTop],
      });
    let deletedImageIDs = [];
    let newImageIDs = [];
    const nodeId = documentId + '/' + node_id;
    const currentFrameTS = snapBack.currentFrameTs || 0;
    if (currentFrameTS !== this.pages[nodeId].lastSavedFrameTs) {
      const imageIDsInCache = bridge.current.getNodeImageIDsFromCache({
        node_id,
        documentId,
      });
      const sets = {
        imageIDsInDom: new Set(imageIDsInDom),
        imageIDsInCache: new Set(imageIDsInCache),
      };
      deletedImageIDs = imageIDsInCache.filter(
        id => !sets.imageIDsInDom.has(id),
      );
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
    if (this.currentNodeId === pageId) snapBack.enable(100);
  };

  cachePages = () => {
    Object.keys(this.pages).forEach(pageId => {
      this.cachePage(pageId);
    });
  };
}
export const pagesManager = new PagesManager();

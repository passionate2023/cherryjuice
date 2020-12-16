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
import { snapBackManager } from '::root/snapback-manager';
import { ScrollIntoHash } from '::helpers/pages-manager/helpers/scroll-into-hash';

const scrollIntoHash = new ScrollIntoHash();

export type ContentEditableProps = PageProps & {
  focusOnUpdate: boolean;
  scrollPosition: [number, number];
  images: Image[];
  updatedContentTs: number;
};
export type PageSelector = (pageId: string) => boolean;
type Page = {
  element: HTMLDivElement;
  updatedContentTs: number;
  currentFrameTS: number;
};

export class PagesManager {
  pages: {
    [id: string]: Page;
  };
  hiddenPagesContainer: HTMLDivElement;
  constructor() {
    this.init();
  }
  private hide = () => {
    const page = getEditor();
    if (page) {
      const { nodeId } = page.dataset;
      if (nodeId) {
        this.hiddenPagesContainer.appendChild(page);
      }
    } else throw new Error('no page is mounted');
  };
  private restore = (nodeId: string) => {
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
    updatedContentTs = 0,
  }: ContentEditableProps) => {
    const editor = getEditorContainer();
    const contentEditable = editor.firstElementChild as HTMLDivElement;
    const renderedNodeId = contentEditable?.dataset?.nodeId;
    const queriedNodeIsUpToDate =
      this.pages[nodeId]?.updatedContentTs === updatedContentTs;
    const queriedNodeIsRendered = renderedNodeId === nodeId;
    const somePageIsRendered = !!renderedNodeId;
    if (!(queriedNodeIsRendered && queriedNodeIsUpToDate)) {
      if (somePageIsRendered) this.hide();
      if (queriedNodeIsUpToDate) this.restore(nodeId);
      else {
        editor.innerHTML = createContentEditable({
          nodeId,
          html,
          editable,
        });
        this.pages[nodeId] = {
          element: editor.firstElementChild as HTMLDivElement,
          updatedContentTs: updatedContentTs,
          currentFrameTS: this.pages[nodeId]?.currentFrameTS || 0,
        };
        snapBackManager.reset(nodeId);
      }
    }
    attachPageImages(editor, images);

    if (focusOnUpdate) editor.focus();
    if (scrollPosition) editor.scrollTo(...scrollPosition);
    scrollIntoHash.scroll();
  };
  setUpdatedContentTs = (
    nodeId: string,
    updatedContentTs: number,
    currentFrameTS: number,
  ): void => {
    this.pages[nodeId].updatedContentTs = updatedContentTs;
    this.pages[nodeId].currentFrameTS = currentFrameTS;
  };

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
  resetPages = (predicate: PageSelector) => {
    const pages = Object.entries(this.pages).filter(([id]) => predicate(id));
    pages.forEach(([id, page]) => {
      page.element.remove();
      delete this.pages[id];
      snapBackManager.reset(id);
    });
  };
}

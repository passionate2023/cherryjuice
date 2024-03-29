import {
  getEditor,
  getEditorContainer,
} from '::helpers/pages-manager/helpers/get-editor';
import { createHiddenPagesContainer } from '::helpers/pages-manager/helpers/create-hidden-pages-container';
import { OnFrameChange, SnapBack } from '::helpers/snapback/snapback/snapback';
import { onFrameChangeFactory } from '::helpers/pages-manager/helpers/on-frame-change-factory';
import { cachePage } from './helpers/cache-page';
import {
  ContentEditableProps,
  Page,
  renderPage,
} from '::helpers/pages-manager/helpers/render-page/render-page';

export type PageSelector = (pageId: string) => boolean;
export type STimer = ReturnType<typeof setTimeout>;

export type PagesManagerConfiguration = {
  autoSaveInterval: number; // ms, smaller then 100 is ignored
};

export class PagesManager {
  pages: {
    [id: string]: Page;
  };
  private configuration: PagesManagerConfiguration = { autoSaveInterval: 0 };
  hiddenPagesContainer: HTMLDivElement;
  private currentNodeId: string;
  current: SnapBack;
  private onFrameChange: OnFrameChange = () => undefined;
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
  setConfiguration = (config: PagesManagerConfiguration) => {
    this.configuration = config;
  };
  setOnFrameChange(onFrameChange: OnFrameChange): void {
    this.onFrameChange = onFrameChangeFactory(
      onFrameChange,
      this.cachePage,
      this.configuration,
    );
  }

  hideCurrentPage = async () => {
    const page = getEditor();
    if (page) {
      const { nodeId } = page.dataset;
      if (nodeId) {
        this.pages[nodeId].snapBack.disable();
        this.pages[nodeId].scrollPosition = [page.scrollLeft, page.scrollTop];
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

  render = (props: ContentEditableProps) => {
    const page = renderPage(props, {
      hidePage: this.hideCurrentPage,
      restorePage: this.restorePage,
      page: this.pages[props.nodeId],
      onFrameChange: this.onFrameChange,
    });
    this.pages[props.nodeId] = page;
    this.currentNodeId = props.nodeId;
    this.current = page.snapBack;
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
    const page = this.pages[pageId];
    cachePage(page);
    if (this.currentNodeId === pageId) page.snapBack.enable(100);
  };

  cachePages = () => {
    Object.keys(this.pages).forEach(pageId => {
      this.cachePage(pageId);
    });
  };
}
export const pagesManager = new PagesManager();

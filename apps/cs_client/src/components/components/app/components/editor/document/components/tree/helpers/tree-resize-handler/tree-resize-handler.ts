import { TreePosition } from '::store/ducks/editor';
import { CssVariables } from '::store/ducks/css-variables';
import { nodeOverlay } from '::app/components/editor/document/components/tree/components/node/helpers/node-overlay';
import { Bubble } from '::app/components/editor/document/components/tree/helpers/tree-resize-handler/helpers/attach-bubble';
import { cssVariables } from '::assets/styles/css-variables/set-css-variables';

const treeSizeLocalStorageKey = 'editor:tree-size';
export class TreeResizeHandler {
  private treeResizeHandle: HTMLDivElement;
  private treePosition: TreePosition;
  private bubble: Bubble = new Bubble();
  private treeSize: { w: number; h: number } = { w: 250, h: 200 };
  private showTree: boolean;
  private updateCssVariable = () => {
    if (this.showTree) {
      if (this.treePosition === 'left') {
        const width = this.treeResizeHandle.offsetWidth;
        cssVariables.setVariable(CssVariables.treeWidth, width + 'px');
        this.treeSize.w = width;
      } else if (this.treePosition === 'bottom') {
        const height = this.treeResizeHandle.offsetHeight;
        cssVariables.setVariable(CssVariables.treeHeight, height + 'px');
        this.treeSize.h = height;
      }
    }
  };
  onResizeStop = () => {
    this.updateCssVariable();
    nodeOverlay.updateWidth();
    nodeOverlay.updateLeft();
    localStorage.setItem(
      treeSizeLocalStorageKey,
      JSON.stringify(this.treeSize),
    );
  };

  onResize = () => {
    this.updateCssVariable();
  };
  init = (treeResizeHandler: HTMLDivElement) => {
    this.treeResizeHandle = treeResizeHandler;
    nodeOverlay.init();
    nodeOverlay.updateWidth();
    this.updateCssVariable();
    const treeSize = localStorage.getItem(treeSizeLocalStorageKey);
    if (treeSize) {
      this.treeSize = JSON.parse(treeSize);
    }
  };
  onTreePositionChange = (treePosition: TreePosition) => {
    if (this.treePosition !== treePosition) {
      this.treePosition = treePosition;
      if (treePosition === 'left') {
        this.treeResizeHandle.style.height = 'auto';
      } else if (treePosition === 'bottom') {
        this.treeResizeHandle.style.width = 'auto';
      }
      this.bubble.init(this.treeResizeHandle, treePosition, this.onResize);
    }
  };
  onTreeVisibilityChange = (showTree: boolean) => {
    if (this.showTree !== showTree) {
      if (showTree) {
        cssVariables.setVariable(
          CssVariables.treeHeight,
          this.treeSize.h + 'px',
        );
        cssVariables.setVariable(
          CssVariables.treeWidth,
          this.treeSize.w + 'px',
        );
        this.bubble.init(
          this.treeResizeHandle,
          this.treePosition,
          this.onResize,
        );
      } else {
        cssVariables.setVariable(CssVariables.treeHeight, 0 + 'px');
        cssVariables.setVariable(CssVariables.treeWidth, 0 + 'px');
      }
      this.showTree = showTree;
    }
  };
}

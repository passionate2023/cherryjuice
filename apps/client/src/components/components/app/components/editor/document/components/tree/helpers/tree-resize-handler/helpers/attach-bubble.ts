import treeModule from '::sass-modules/tree/tree.scss';
import { TreePosition } from '::store/ducks/editor';
export class Bubble {
  bubble: HTMLDivElement;

  init = (
    handle: HTMLDivElement,
    treePosition: TreePosition,
    onResize: () => void,
  ) => {
    if (this.bubble) {
      this.bubble.remove();
    }
    this.bubble = document.createElement('div');
    this.bubble.classList.add(treeModule.tree__resizeHandle__bubble);
    this.bubble.onclick = onResize;
    if (treePosition === 'bottom') {
      this.bubble.classList.remove(treeModule.tree__resizeHandle__bubbleLeft);
      this.bubble.classList.add(treeModule.tree__resizeHandle__bubbleBottom);
    } else if (treePosition === 'left') {
      this.bubble.classList.add(treeModule.tree__resizeHandle__bubbleLeft);
      this.bubble.classList.remove(treeModule.tree__resizeHandle__bubbleBottom);
    }
    handle.lastElementChild.lastElementChild.appendChild(this.bubble);
  };
}

import treeModule from '::sass-modules/tree/tree.scss';
import { ac } from '::store/store';
import { CssVariables } from '::store/ducks/css-variables';
import { nodeOverlay } from '::app/components/editor/document/components/tree/components/node/helpers/node-overlay';
import { cssVariables } from '::assets/styles/css-variables/set-css-variables';

const attachTreeResizeBubble = onResize => {
  const handleRef = document.querySelector('.' + treeModule.tree__resizeHandle);
  const handle = document.createElement('div');
  handle.classList.add(treeModule.tree__resizeHandle__bubble);
  handle.onclick = onResize;
  handleRef.lastElementChild.lastElementChild.appendChild(handle);
};
const createTreeHelper = () => {
  const state: { tree: HTMLDivElement } = {
    tree: undefined,
  };
  return {
    init: () => (state.tree = document.querySelector('.' + treeModule.tree)),
    updateTreeSizeCssVariable: () => {
      cssVariables.setVariable(
        CssVariables.treeWidth,
        state.tree.offsetWidth + 'px',
      );
    },
    getTreeWidth: () => state.tree.offsetWidth,
  };
};
const treeHelper = createTreeHelper();
const onResizeStop = () => {
  ac.cssVariables.set(CssVariables.treeWidth, treeHelper.getTreeWidth());
  treeHelper.updateTreeSizeCssVariable();
  nodeOverlay.updateWidth();
  nodeOverlay.updateLeft();
};
const onResize = () => {
  treeHelper.updateTreeSizeCssVariable();
};
const onStart = () => {
  treeHelper.init();
  nodeOverlay.init();
  nodeOverlay.updateWidth();
  attachTreeResizeBubble(onResize);
};
export { onStart, onResize, onResizeStop };

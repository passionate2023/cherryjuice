import treeModule from '::sass-modules/tree/tree.scss';
import { nodeOverlay } from '../components/node/helpers/node-overlay';
import { ac } from '::store/store';
import { CssVariables } from '::store/ducks/css-variables';

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
      ac.cssVariables.set(CssVariables.treeWidth, state.tree.offsetWidth);
    },
    getTreeWidth: () => state.tree.offsetWidth,
  };
};
const treeHelper = createTreeHelper();
const onResizeStop = () => {
  ac.cssVariables.set(CssVariables.treeWidth, treeHelper.getTreeWidth());
  treeHelper.updateTreeSizeCssVariable();
  nodeOverlay.updateWidth();
};
const onResize = () => {
  treeHelper.updateTreeSizeCssVariable();
  nodeOverlay.updateWidth();
};
const onStart = () => {
  treeHelper.init();
  nodeOverlay.init();
  nodeOverlay.updateWidth();
  attachTreeResizeBubble(onResize);
};
export { onStart, onResize, onResizeStop };

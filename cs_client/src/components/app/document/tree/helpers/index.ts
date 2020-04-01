import treeModule from '::sass-modules/tree/tree.scss';
import { cssVariables } from '../../../../../assets/styles/css-variables/set-css-variables';

const createTreeHelper = () => {
  const state = {
    tree: { size: { width: 0 } },
  };
  // @ts-ignore
  return {
    init: () => (state.tree = document.querySelector('.' + treeModule.tree)),
    updateTreeSizeCssVariable: () => {
      cssVariables.setTreeWidth(state.tree.offsetWidth);
    },
    getTreeWidth: () => state.tree.offsetWidth,
  };
  // nodeOverlay.updateWidth();
};

export { createTreeHelper };

import { cssVariables } from '::assets/styles/css-variables/set-css-variables';
import treeModule from '::sass-modules/tree/tree.scss';

const createNodeOverlayHelper = () => {
  const state = {
    tree: { scrollWidth: 250 },
    node: {
      getBoundingClientRect: () => ({ left: 0 }),
    },
  };
  return {
    init: () =>
      (state.tree = document.querySelector('.' + treeModule.tree_rootList)),
    setNode: node => {
      state.node = node;
    },
    updateWidth: () => {
      cssVariables.setOverlayWidth(0);
      cssVariables.setOverlayWidth(state.tree.scrollWidth - 40);
    },
    updateLeft: () => {
      const nodeRect = state.node.getBoundingClientRect();
      cssVariables.setOverlayLeft(nodeRect.left);
    },
  };
};
const nodeOverlay = createNodeOverlayHelper();

export { nodeOverlay };

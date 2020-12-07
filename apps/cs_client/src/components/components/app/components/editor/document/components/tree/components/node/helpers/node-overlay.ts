import { cssVariables } from '::assets/styles/css-variables/set-css-variables';
import treeModule from '::sass-modules/tree/tree.scss';

const createNodeOverlayHelper = () => {
  const state = {
    tree: { scrollWidth: 250 },
  };
  return {
    init: () =>
      (state.tree = document.querySelector('.' + treeModule.tree_rootList)),
    updateWidth: () => {
      cssVariables.setOverlayWidth(0);
      cssVariables.setOverlayWidth(state.tree.scrollWidth - 40);
    },
    updateLeft: overlayParent => {
      const nodeRect = overlayParent.current.getBoundingClientRect();
      cssVariables.setOverlayLeft(nodeRect.left);
    },
  };
};
const nodeOverlay = createNodeOverlayHelper();

export { nodeOverlay };

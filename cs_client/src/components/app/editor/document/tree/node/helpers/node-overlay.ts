import { cssVariables } from '::assets/styles/css-variables/set-css-variables';
import treeModule from '::sass-modules/tree/tree.scss';
import { appInitialState } from '::app/reducer';

const createNodeOverlayHelper = () => {
  const state = {
    tree: { scrollWidth: appInitialState.treeSize },
  };
  return {
    init: () => (state.tree = document.querySelector('.' + treeModule.tree)),
    updateWidth: () => {
      cssVariables.setOverlayWidth(0);
      cssVariables.setOverlayWidth(state.tree.scrollWidth);
    },
    updateLeft: overlayParent => {
      const nodeRect = overlayParent.current.getBoundingClientRect();
      cssVariables.setOverlayLeft(nodeRect.left);
    },
  };
};
const nodeOverlay = createNodeOverlayHelper();

export { nodeOverlay };

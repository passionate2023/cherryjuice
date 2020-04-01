import treeModule from '::sass-modules/tree/tree.scss';
import * as React from 'react';
import { Ref, useEffect } from 'react';
import { Node } from './node';
import { Ct_Node_Meta } from '::types/generated';
import { ErrorBoundary } from '::shared-components/error-boundary';
import { Resizable } from 're-resizable';
import { nodeOverlay } from './node/helpers/node-overlay';
import { cssVariables } from '../../../../assets/styles/css-variables/set-css-variables';
import { appActionCreators } from '../../reducer';

type Props = {
  nodes: Map<number, Ct_Node_Meta>;
  treeRef: Ref<any>;
  dispatch: (action: { type: string; value?: any }) => void;
};
const createTreeHelper = () => {
  const state: { tree: HTMLDivElement } = {
    tree: undefined,
  };
  return {
    init: () => (state.tree = document.querySelector('.' + treeModule.tree)),
    updateTreeSizeCssVariable: () => {
      cssVariables.setTreeWidth(state.tree.offsetWidth);
    },
    getTreeWidth: () => state.tree.offsetWidth,
  };
};
const treeHelper = createTreeHelper();
const onResizeStop = () => {
  appActionCreators.setTreeWidth(treeHelper.getTreeWidth());
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
};
const Tree: React.FC<Props> = ({ nodes, dispatch }) => {
  useEffect(onStart, []);
  return (
    <Resizable
      enable={{ right: true }}
      onResize={onResize}
      onResizeStop={onResizeStop}
      className={treeModule.tree__resizeHandle}
    >
      <div className={treeModule.tree}>
        <ErrorBoundary>
          <ul className={treeModule.tree_rootList}>
            {nodes &&
              nodes
                .get(0)
                .child_nodes.map(node_id => nodes.get(node_id))
                .map(node => (
                  <Node
                    key={node.node_id}
                    node_id={node.node_id}
                    nodes={nodes}
                    depth={0}
                    dispatch={dispatch}
                    styles={node.node_title_styles}
                    icon_id={node.icon_id}
                  />
                ))}
          </ul>
        </ErrorBoundary>
      </div>
    </Resizable>
  );
};
export { Tree };

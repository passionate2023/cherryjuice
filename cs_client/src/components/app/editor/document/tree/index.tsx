import treeModule from '::sass-modules/tree/tree.scss';
import * as React from 'react';
import { useEffect } from 'react';
import { Node } from './node';
import { Ct_Node_Meta } from '::types/generated';
import { ErrorBoundary } from '::shared-components/error-boundary';
import { Resizable } from 're-resizable';
import { onResize, onResizeStop, onStart } from './helpers';

type Props = {
  nodes: Map<number, Ct_Node_Meta>;
};

const Tree: React.FC<Props> = ({ nodes }) => {
  useEffect(onStart, []);
  return (
    <Resizable
      enable={{ right: true }}
      onResize={onResize}
      onResizeStop={onResizeStop}
      className={treeModule.tree__resizeHandle}
    >
      <ErrorBoundary>
        <div className={treeModule.tree}>
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
                    styles={node.node_title_styles}
                    icon_id={node.icon_id}
                  />
                ))}
          </ul>
        </div>
      </ErrorBoundary>
    </Resizable>
  );
};
export { Tree };

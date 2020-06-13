import treeModule from '::sass-modules/tree/tree.scss';
import * as React from 'react';
import { useEffect, useRef } from 'react';
import { Node } from './node';
import { NodeMeta } from '::types/graphql/adapters';
import { ErrorBoundary } from '::shared-components/error-boundary';
import { Resizable } from 're-resizable';
import { onResize, onResizeStop, onStart } from './helpers';
import { useDnDNodes } from '::app/editor/document/tree/node/hooks/dnd-nodes';

type Props = {
  nodes: Map<number, NodeMeta>;
};

const Tree: React.FC<Props> = ({ nodes }) => {
  useEffect(onStart, []);
  const componentRef = useRef();
  const rootTreeDndProps = useDnDNodes({
    componentRef,
    nodes,
    node_id: 0,
    draggable: false,
  });
  return (
    <Resizable
      enable={{ right: true }}
      onResize={onResize}
      onResizeStop={onResizeStop}
      className={treeModule.tree__resizeHandle}
    >
      <ErrorBoundary>
        <div className={treeModule.tree}>
          <ul
            className={treeModule.tree_rootList}
            {...rootTreeDndProps}
            ref={componentRef}
          >
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
                    node_title_styles={node.node_title_styles}
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

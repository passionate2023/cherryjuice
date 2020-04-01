import treeModule from '::sass-modules/tree/tree.scss';
import * as React from 'react';
import { Ref } from 'react';
import { Node } from './node';
import { Ct_Node_Meta } from '::types/generated';
import { ErrorBoundary } from '::shared-components/error-boundary';
import { Resizable } from 're-resizable';
import { appActions } from '::app/reducer';

type Props = {
  nodes: Map<number, Ct_Node_Meta>;
  treeRef: Ref<any>;
  onResize: () => void;
  dispatch: (action: { type: string; value?: any }) => void;
};

const Tree: React.FC<Props> = ({
  nodes,
  treeRef,
  onResize,
  dispatch,
}) => {
  return (
    <Resizable
      ref={treeRef}
      enable={{ right: true }}
      onResize={onResize}
      onResizeStop={() =>
        dispatch({
          type: appActions.RESIZE_TREE,
          // @ts-ignore
          value: treeRef.current.size.width,
        })
      }
      className={treeModule.tree__resizeHandle}
    >
      <div className={treeModule.tree}>
        <ErrorBoundary dispatch={dispatch}>
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

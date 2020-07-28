import treeModule from '::sass-modules/tree/tree.scss';
import * as React from 'react';
import { useEffect, useRef } from 'react';
import { Node } from './node';
import { ErrorBoundary } from '::shared-components/error-boundary';
import { Resizable } from 're-resizable';
import { onResize, onResizeStop, onStart } from './helpers';
import { useDnDNodes } from '::app/editor/document/tree/node/hooks/dnd-nodes';
import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::root/store/store';

type Props = {};

const mapState = (state: Store) => ({
  nodes: state.document.nodes,
  documentPrivacy: state.document.privacy,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

const Tree: React.FC<Props & PropsFromRedux> = ({ nodes, documentPrivacy }) => {
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
              nodes.get(0).child_nodes.map(node_id => {
                const node = nodes.get(node_id);
                return (
                  <Node
                    key={node.node_id}
                    node_id={node.node_id}
                    nodes={nodes}
                    depth={0}
                    node_title_styles={node.node_title_styles}
                    documentPrivacy={documentPrivacy}
                  />
                );
              })}
          </ul>
        </div>
      </ErrorBoundary>
    </Resizable>
  );
};
const _ = connector(Tree);
export { _ as Tree };

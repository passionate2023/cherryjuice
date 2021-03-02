import * as React from 'react';
import { Droppable } from '::app/components/editor/document/components/tree/components/node/_/droppable';
import { modNode, modTree } from '::sass-modules';
import { ac, Store } from '::store/store';
import nodeMod from '::sass-modules/tree/node.scss';
import { Node } from '::app/components/editor/document/components/tree/components/node/node';
import { NodePrivacy } from '@cherryjuice/graphql-types';
import { getCurrentDocument } from '::store/selectors/cache/document/document';
import { connect, ConnectedProps } from 'react-redux';
import { getParamsFromLocation } from '::app/components/editor/document/components/tree/root-list/helpers/get-params-from-location';
import { useEffect } from 'react';
import { nodeOverlay } from '::app/components/editor/document/components/tree/components/node/helpers/node-overlay';
const mapState = (state: Store) => {
  const document = getCurrentDocument(state);
  return {
    nodes: document?.nodes,
    documentPrivacy: document?.privacy,
    treeState: document?.persistedState?.treeState,
    filteredNodes: state.document.filteredNodes,
    documentId: state.document.documentId,
    selectedNode_id: document?.persistedState?.selectedNode_id,
  };
};
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

const RootList: React.FC<PropsFromRedux> = ({
  nodes,
  documentPrivacy,
  treeState,
  filteredNodes,
  documentId,
  selectedNode_id,
}) => {
  const params = getParamsFromLocation();
  useEffect(() => {
    nodeOverlay.init();
    nodeOverlay.updateWidth();
  }, []);
  useEffect(() => {
    if (selectedNode_id) {
      const node = document
        .querySelector('.' + modTree.tree)
        .querySelector(`[data-node-id="${selectedNode_id}"]`);
      if (node) {
        nodeOverlay.setNode(node);
        nodeOverlay.updateWidth();
        nodeOverlay.updateLeft();
      }
    }
  }, [selectedNode_id]);
  return (
    <Droppable
      anchorId={'0'}
      anchorClassName={modNode.node}
      meta={{ documentId }}
      onDrop={ac.node.drop}
      onDragEnterStyleClass={nodeMod.droppableDraggingOver}
    >
      {(provided, ref) => (
        <ul
          className={modTree.tree_rootList}
          {...provided}
          ref={ref}
          // onContextMenu={show}
        >
          {nodes &&
            nodes[0] &&
            nodes[0].child_nodes.map((node_id, index) => {
              const node = nodes[node_id];
              if (!filteredNodes || filteredNodes[node_id])
                return (
                  <Node
                    index={index}
                    fatherState={treeState[0]}
                    key={node.node_id}
                    node_id={node.node_id}
                    nodes={nodes}
                    depth={0}
                    node_title_styles={node.node_title_styles}
                    documentPrivacy={documentPrivacy}
                    parentPrivacy={NodePrivacy.DEFAULT}
                    expand={params.expand}
                    filteredNodes={filteredNodes}
                  />
                );
            })}
        </ul>
      )}
    </Droppable>
  );
};
const _ = connector(RootList);
export { _ as RootList };

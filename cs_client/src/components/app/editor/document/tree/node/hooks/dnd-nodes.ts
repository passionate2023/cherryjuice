import nodeMod from '::sass-modules/tree/node.scss';
import { updatedCachedMeta } from '::app/editor/document/tree/node/helpers/apollo-cache';
import { documentActionCreators } from '::app/editor/document/reducer/action-creators';
import { NodeMeta } from '::types/graphql/adapters';
import { MutableRefObject, useMemo } from 'react';
import { appActionCreators } from '::app/reducer';
import { AlertType } from '::types/react';

const updateCache = ({
  cache,
  fatherOfDroppedNode,
  targetNode,
  droppedNode,
}) => {
  updatedCachedMeta({
    cache,
    nodeId: droppedNode.id,
    meta: {
      position: targetNode.child_nodes.length - 1,
      father_id: targetNode.node_id,
    },
  });
  updatedCachedMeta({
    cache,
    nodeId: fatherOfDroppedNode.id,
    meta: {
      child_nodes: fatherOfDroppedNode.child_nodes,
    },
  });
  updatedCachedMeta({
    cache,
    nodeId: targetNode.id,
    meta: {
      child_nodes: targetNode.child_nodes,
    },
  });
};

const switchParent = ({ fatherOfDroppedNode, targetNode, droppedNode }) => {
  const ogIndexOfDroppedNode = fatherOfDroppedNode.child_nodes.indexOf(
    Number(droppedNode.node_id),
  );
  fatherOfDroppedNode.child_nodes.splice(ogIndexOfDroppedNode, 1);
  targetNode.child_nodes.push(Number(droppedNode.node_id));
  droppedNode.father_id = targetNode.node_id;
  droppedNode.position = targetNode.child_nodes.length - 1;
};

const notifyLocalStore = ({
  droppedNode,
  fatherOfDroppedNode,
  targetNode,
}: {
  droppedNode: NodeMeta;
  fatherOfDroppedNode: NodeMeta;
  targetNode: NodeMeta;
}) => {
  documentActionCreators.setNodeMetaHasChanged(droppedNode.id, ['father_id']);
  documentActionCreators.setNodeMetaHasChanged(targetNode.id, ['child_nodes']);
  documentActionCreators.setNodeMetaHasChanged(fatherOfDroppedNode.id, [
    'child_nodes',
  ]);
};

type Props = {
  node_id: number;
  nodes?: Map<number, NodeMeta>;
  componentRef: MutableRefObject<HTMLDivElement>;
  cache;
  draggable: boolean;
};

const useDnDNodes = ({
  node_id,
  componentRef,
  nodes,
  cache,
  draggable = true,
}: Props) => {
  const { addClass, removeClass } = useMemo(() => {
    const addClass = e => {
      e.preventDefault();
      componentRef.current.classList.add(nodeMod.nodeDragHover);
    };
    const removeClass = e => {
      e.preventDefault();
      componentRef.current.classList.remove(nodeMod.nodeDragHover);
    };
    return { addClass, removeClass };
  }, []);

  const { setId, moveNode } = useMemo(
    () => ({
      setId: e => {
        e.dataTransfer.setData('text/plain', String(node_id));
      },
      moveNode: e => {
        removeClass(e);
        const dropped_node_id = e.dataTransfer.getData('text/plain');
        if (dropped_node_id !== '' + node_id) {
          const droppedNode = nodes.get(Number(dropped_node_id));
          const fatherOfDroppedNode = nodes.get(droppedNode.father_id);
          const targetNode = nodes.get(node_id);
          if (droppedNode.child_nodes.includes(targetNode.node_id))
            appActionCreators.setAlert({
              title: 'forbidden operation',
              type: AlertType.Information,
              description: "a child node can't be a target",
            });
          else {
            switchParent({
              targetNode,
              fatherOfDroppedNode,
              droppedNode,
            });
            updateCache({
              targetNode,
              fatherOfDroppedNode,
              droppedNode,
              cache,
            });
            notifyLocalStore({
              targetNode,
              fatherOfDroppedNode,
              droppedNode,
            });
          }
        }
      },
    }),
    [node_id, nodes],
  );

  return {
    draggable,
    onDragStart: draggable && setId,
    onDrop: moveNode,
    onDragEnter: addClass,
    onDragOver: addClass,
    onDragLeave: removeClass,
    onDragEnd: removeClass,
  };
};

export { useDnDNodes };

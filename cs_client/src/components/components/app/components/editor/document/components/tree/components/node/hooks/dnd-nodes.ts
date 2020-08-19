import nodeMod from '::sass-modules/tree/node.scss';
import { MutableRefObject, useMemo } from 'react';
import { AlertType } from '::types/react';
import { modTree } from '::sass-modules';
import { ac } from '::store/store';
import { NodesDict } from '::store/ducks/cache/document-cache';

const updateCache = ({ fatherOfDroppedNode, targetNode, droppedNode }) => {
  // apolloCache.node.mutate({
  //   nodeId: droppedNode.id,
  //   meta: {
  //     father_id: targetNode.node_id,
  //     fatherId: targetNode.id,
  //   },
  // });
  ac.documentCache.mutateNode({
    node_id: droppedNode.node_id,
    documentId: droppedNode.documentId,
    data: {
      father_id: targetNode.node_id,
      fatherId: targetNode.id,
    },
  });
  // apolloCache.node.mutate({
  //   nodeId: fatherOfDroppedNode.id,
  //   meta: {
  //     child_nodes: fatherOfDroppedNode.child_nodes,
  //   },
  // });
  ac.documentCache.mutateNode({
    node_id: fatherOfDroppedNode.node_id,
    documentId: fatherOfDroppedNode.documentId,
    data: {
      child_nodes: fatherOfDroppedNode.child_nodes,
    },
  });
  // apolloCache.node.mutate({
  //   nodeId: targetNode.id,
  //   meta: {
  //     child_nodes: targetNode.child_nodes,
  //   },
  // });
  ac.documentCache.mutateNode({
    node_id: targetNode.node_id,
    documentId: targetNode.documentId,
    data: {
      child_nodes: targetNode.child_nodes,
    },
  });
};

const switchParent = ({
  fatherOfDroppedNode,
  targetNode,
  droppedNode,
  position,
}) => {
  const ogIndexOfDroppedNode = fatherOfDroppedNode.child_nodes.indexOf(
    Number(droppedNode.node_id),
  );
  fatherOfDroppedNode.child_nodes.splice(ogIndexOfDroppedNode, 1);
  if (!targetNode.child_nodes.includes(Number(droppedNode.node_id)))
    position === -1
      ? targetNode.child_nodes.push(Number(droppedNode.node_id))
      : targetNode.child_nodes.splice(position, 0, Number(droppedNode.node_id));
  droppedNode.father_id = targetNode.node_id;
  droppedNode.fatherId = targetNode.id;
  droppedNode.position = targetNode.child_nodes.length - 1;
};

const calculateDroppingPosition = (e): number => {
  let position = -1;
  const droppedThrough = e.nativeEvent.path[0];
  const actualTarget = e.currentTarget;
  let nodes = [];
  if (droppedThrough !== actualTarget && actualTarget.localName === 'ul') {
    const above = e.nativeEvent.layerY / droppedThrough.clientHeight < 0.5;
    nodes = Array.from(
      actualTarget.querySelectorAll(
        ':scope>div.node:not([data-dragged="true"])',
      ),
    );
    position = [nodes.indexOf(droppedThrough) + (above ? 0 : 1)].map(position =>
      Math.max(position, 0),
    )[0];
  }
  return position;
};
const getFatherIdChain = (
  nodes: NodesDict,
  node_id: number,
  father_id_chain: number[] = [],
) => {
  const father_id = nodes[node_id].father_id;
  return father_id === 0
    ? [...father_id_chain, 0]
    : getFatherIdChain(nodes, father_id, [...father_id_chain, father_id]);
};
type Props = {
  node_id: number;
  componentRef: MutableRefObject<HTMLDivElement>;
  nodes?: NodesDict;
  draggable?: boolean;
  afterDrop?: Function;
};
const useDnDNodes = ({
  node_id: target_node_id,
  componentRef,
  nodes,
  draggable = true,
  afterDrop,
}: Props) => {
  const { addClass, removeClass } = useMemo(() => {
    const addClass = e => {
      e.preventDefault();
      e.stopPropagation();
      componentRef.current.classList.add(nodeMod.nodeDragHover);
      if (draggable)
        componentRef.current.parentElement.setAttribute('data-dragged', 'true');
    };
    const removeClass = (e, nodeTitle = componentRef.current) => {
      e.preventDefault();
      e.stopPropagation();
      nodeTitle.classList.remove(nodeMod.nodeDragHover);
      nodeTitle.parentElement.removeAttribute('data-dragged');
    };
    return { addClass, removeClass };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { setId, moveNode } = useMemo(
    () => ({
      setId: e => {
        e.dataTransfer.setData('text/plain', String(target_node_id));
      },
      moveNode: e => {
        e.preventDefault();
        e.stopPropagation();
        const actualTarget = e.currentTarget;
        if (
          actualTarget.localName === 'ul' &&
          !actualTarget.classList.contains(modTree.tree_rootList)
        ) {
          const nodeTitle = actualTarget.previousSibling.lastChild;
          removeClass(e, nodeTitle);
        } else removeClass(e);
        const dropped_node_id = e.dataTransfer.getData('text/plain');
        if (dropped_node_id !== '' + target_node_id) {
          const droppedNode = nodes[Number(dropped_node_id)];
          const fatherOfDroppedNode = nodes[droppedNode.father_id];
          const targetNode = nodes[target_node_id];
          const father_id_chain = new Set(
            target_node_id === 0
              ? [0]
              : getFatherIdChain(nodes, target_node_id),
          );
          const fatherDroppedToChild = droppedNode.child_nodes.some(
            child_node => father_id_chain.has(child_node),
          );
          if (fatherDroppedToChild)
            ac.dialogs.setAlert({
              title: 'forbidden operation',
              type: AlertType.Warning,
              description: "a child node can't be a target",
            });
          else {
            const position = calculateDroppingPosition(e);
            switchParent({
              targetNode,
              fatherOfDroppedNode,
              droppedNode,
              position,
            });
            updateCache({
              targetNode,
              fatherOfDroppedNode,
              droppedNode,
            });
            if (afterDrop) afterDrop({ e, node_id: droppedNode.node_id });
          }
        }
      },
    }),
    [target_node_id, nodes, afterDrop, removeClass],
  );

  return {
    draggable,
    onDragStart: draggable ? setId : undefined,
    onDrop: moveNode,
    onDragEnter: addClass,
    onDragOver: addClass,
    onDragLeave: removeClass,
    onDragEnd: removeClass,
  };
};

export { useDnDNodes };

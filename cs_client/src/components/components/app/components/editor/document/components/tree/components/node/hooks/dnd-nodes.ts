import nodeMod from '::sass-modules/tree/node.scss';
import { MutableRefObject, useMemo } from 'react';
import { AlertType } from '::types/react';
import { modTree } from '::sass-modules';
import { ac } from '::store/store';
import { NodesDict } from '::store/ducks/cache/document-cache';

const switchParent = ({
  fatherOfDroppedNode,
  targetNode,
  droppedNode,
  position,
}) => {
  const targetNodeChildNodes = [...targetNode.child_nodes];
  if (!targetNodeChildNodes.includes(Number(droppedNode.node_id)))
    position === -1
      ? targetNodeChildNodes.push(Number(droppedNode.node_id))
      : targetNodeChildNodes.splice(position, 0, Number(droppedNode.node_id));
  ac.documentCache.mutateNodeMeta([
    {
      node_id: droppedNode.node_id,
      documentId: droppedNode.documentId,
      data: {
        father_id: targetNode.node_id,
        fatherId: targetNode.id,
      },
    },
    {
      node_id: fatherOfDroppedNode.node_id,
      documentId: fatherOfDroppedNode.documentId,
      data: {
        child_nodes: fatherOfDroppedNode.child_nodes.filter(
          node_id => node_id !== droppedNode.node_id,
        ),
      },
    },
    {
      node_id: targetNode.node_id,
      documentId: targetNode.documentId,
      data: {
        child_nodes: targetNodeChildNodes,
      },
    },
  ]);
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
const getFatherIdChain = (father_id_chain: number[] = []) => (
  nodes: NodesDict,
) => (node_id: number) => {
  const father_id = nodes[node_id].father_id;
  return father_id === 0
    ? [...father_id_chain, 0]
    : getFatherIdChain([...father_id_chain, father_id])(nodes)(father_id);
};
type Props = {
  node_id: number;
  componentRef: MutableRefObject<HTMLDivElement>;
  nodes?: NodesDict;
  draggable?: boolean;
};
const useDnDNodes = ({
  node_id: target_node_id,
  componentRef,
  nodes,
  draggable = true,
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
        const b =
          actualTarget.localName === 'ul' &&
          !actualTarget.classList.contains(modTree.tree_rootList);
        if (b) {
          const nodeTitle = actualTarget.previousSibling.lastChild;
          removeClass(e, nodeTitle);
        } else removeClass(e);
        const dropped_node_id = e.dataTransfer.getData('text/plain');
        if (dropped_node_id !== '' + target_node_id) {
          const droppedNode = nodes[Number(dropped_node_id)];
          const fatherOfDroppedNode = nodes[droppedNode.father_id];
          const targetNode = nodes[target_node_id];
          const target_node_father_id_chain = new Set(
            target_node_id === 0
              ? [0]
              : getFatherIdChain([target_node_id])(nodes)(target_node_id),
          );
          const nodeDroppedToItsChild = droppedNode.child_nodes.some(
            child_node => target_node_father_id_chain.has(child_node),
          );
          if (fatherOfDroppedNode.node_id === target_node_id) return;
          if (nodeDroppedToItsChild)
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
          }
        }
      },
    }),
    [target_node_id, nodes, removeClass],
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

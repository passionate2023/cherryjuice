import * as React from 'react';
import { modNodePath } from '::sass-modules';
import { Node } from './components/node';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::store/store';
import { getCurrentDocument } from '::store/selectors/cache/document/document';
import { getParentsNode_ids } from '::store/ducks/document-cache/helpers/node/expand-node/helpers/tree/helpers/get-parents-node-ids/get-parents-node-ids';
import {
  createNodePropsMapper,
  useChildCM,
} from '::root/components/app/components/editor/document/components/title-and-recent-nodes/tabs-container';
import { ContextMenuWrapper } from '::root/components/shared-components/context-menu/context-menu-wrapper';
import { ContextMenuItemProps } from '::root/components/shared-components/context-menu/context-menu-item';
import { useEffect, useMemo, useRef } from 'react';

const mapState = (state: Store) => {
  const document = getCurrentDocument(state);
  return {
    nodes: document?.nodes || {},
    selectedNode_id: document?.persistedState?.selectedNode_id,
    documentId: document?.id,
    localState: document?.localState,
  };
};
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};

const NodePath: React.FC<Props & PropsFromRedux> = ({
  nodes,
  selectedNode_id,
  documentId,
  localState,
}) => {
  const nodesR = useRef<HTMLDivElement>();
  useEffect(() => {
    nodesR.current.scrollLeft += nodesR.current.scrollWidth;
  }, [selectedNode_id]);
  const { elementId, position, onContextMenu, hide, shown } = useChildCM();
  const mapNodeProps = createNodePropsMapper(
    nodes,
    localState,
    selectedNode_id,
  );
  const father_ids = nodes[selectedNode_id]
    ? getParentsNode_ids({
        nodes,
        node_id: selectedNode_id,
      }).reverse()
    : [];
  const nodeProps = father_ids.map(mapNodeProps);
  const contextMenuItems: Omit<ContextMenuItemProps, 'hide'>[] = useMemo(() => {
    return elementId && nodes[elementId]
      ? nodes[elementId].child_nodes.map(node_id => ({
          name: nodes[node_id].name,
          onClick: () => ac.node.select({ node_id, documentId }),
        }))
      : [];
  }, [elementId, nodes, documentId]);

  return (
    <div className={modNodePath.nodePath} onContextMenu={onContextMenu}>
      <ContextMenuWrapper
        shown={shown}
        hide={hide}
        items={contextMenuItems}
        position={position}
      >
        <div
          className={modNodePath.nodePath__nodes}
          onContextMenu={onContextMenu}
          ref={nodesR}
        >
          {nodeProps.map(node => (
            <React.Fragment key={node.node_id}>
              <Node {...node} documentId={documentId} />
            </React.Fragment>
          ))}
          {!!selectedNode_id && (
            <Node documentId={documentId} {...mapNodeProps(selectedNode_id)} />
          )}
        </div>
      </ContextMenuWrapper>
    </div>
  );
};

const _ = connector(NodePath);
export { _ as NodePath };

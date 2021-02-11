import * as React from 'react';
import { modNodePath } from '::sass-modules';
import { Node } from './components/node';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::store/store';
import { getCurrentDocument } from '::store/selectors/cache/document/document';
import { getParentsNode_ids } from '::store/ducks/document-cache/helpers/node/expand-node/helpers/tree/helpers/get-parents-node-ids/get-parents-node-ids';
import { CMItem } from '::root/components/shared-components/context-menu/context-menu-item';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createNodePropsMapper } from '::root/components/app/components/tabs/helpers/map-props';
import { ContextMenuWrapper } from '::shared-components/context-menu/context-menu-wrapper';

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

type Props = Record<string, never>;

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
  const [activeTab, setActiveTab] = useState<number>();

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
  const contextMenuItems: CMItem[] = useMemo(() => {
    return activeTab && nodes[activeTab]
      ? nodes[activeTab].child_nodes.map(node_id => ({
          name: nodes[node_id].name,
          onClick: () => ac.node.select({ node_id, documentId }),
        }))
      : [];
  }, [activeTab, nodes, documentId]);
  const hookProps = {
    onSelectElement: id => setActiveTab(+id),
    getIdOfActiveElement: target =>
      target.dataset.id || target.parentElement.dataset.id,
  };
  return (
    <ContextMenuWrapper items={contextMenuItems} hookProps={hookProps}>
      {({ ref, show }) => (
        <div className={modNodePath.nodePath} onContextMenu={show} ref={ref}>
          <div
            className={modNodePath.nodePath__nodes}
            onContextMenu={show}
            ref={nodesR}
          >
            {nodeProps.map(node => (
              <React.Fragment key={node.node_id}>
                <Node {...node} documentId={documentId} />
              </React.Fragment>
            ))}
            {!!selectedNode_id && (
              <Node
                documentId={documentId}
                {...mapNodeProps(selectedNode_id)}
              />
            )}
          </div>
        </div>
      )}
    </ContextMenuWrapper>
  );
};

const _ = connector(NodePath);
export { _ as NodePath };

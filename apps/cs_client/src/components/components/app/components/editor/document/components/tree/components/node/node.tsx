import * as React from 'react';
import { useRef } from 'react';
import { useSelectNode } from '::root/components/app/components/editor/document/components/tree/components/node/hooks/select-node';
import { NodePrivacy, Privacy } from '@cherryjuice/graphql-types';
import { ToggleChildren } from '::root/components/app/components/editor/document/components/tree/components/node/components/toggle-children';
import { NodeOverlay } from '::root/components/app/components/editor/document/components/tree/components/node/components/node-overlay';
import { NodeChildren } from '::root/components/app/components/editor/document/components/tree/components/node/components/node-children';
import { NodesDict } from '::store/ducks/document-cache/document-cache';
import { NodeState } from '::store/ducks/document-cache/helpers/node/expand-node/helpers/tree/helpers/expand/expand-node';
import { FilteredNodes } from '::store/epics/filter-tree/helpers/filter-tree/filter-tree';
import { NodeTitle } from '::root/components/app/components/editor/document/components/tree/components/node/components/node-title';
import { useSelector } from 'react-redux';
import { Store } from '::store/store';
import { NodeIcons } from '::root/components/app/components/editor/document/components/tree/components/node/components/node-icons/node-icons';
import { modNode } from '::sass-modules';

export type NodeProps = {
  node_id: number;
  nodes?: NodesDict;
  depth: number;
  node_title_styles: string;
  documentPrivacy: Privacy;
  parentPrivacy: NodePrivacy;
  expand?: number;
  fatherState: NodeState;
  filteredNodes: FilteredNodes;
  index: number;
};

const Node: React.FC<NodeProps> = ({
  node_id,
  nodes,
  depth,
  node_title_styles = '{}',
  documentPrivacy,
  parentPrivacy,
  expand,
  fatherState,
  filteredNodes,
  index,
}) => {
  const online = useSelector((state: Store) => state.root.online);
  const userId = useSelector((state: Store) => state.auth.user?.id);
  const documentId = useSelector((state: Store) => state.document.documentId);
  const { child_nodes, name, privacy, html, read_only, tags } = nodes[node_id];
  const componentRef = useRef();

  const showChildren =
    expand > depth || !!(fatherState && fatherState[node_id]);

  const { clickTimestamp, selectNode } = useSelectNode({
    documentId,
    node_id,
  });

  const nodeStyle = JSON.parse(node_title_styles || '{}');
  const icon_id = +nodeStyle.icon_id;
  return (
    <>
      <div
        className={`${modNode.node} ${
          !online && !html ? modNode.nodeNotAvailable : ''
        }`}
        ref={componentRef}
        onClick={selectNode}
        data-node-id={node_id}
      >
        <ToggleChildren
          depth={depth}
          child_nodes={child_nodes}
          showChildren={showChildren}
          node_id={node_id}
          documentId={documentId}
        />
        <NodeIcons
          documentPrivacy={documentPrivacy}
          parentPrivacy={parentPrivacy}
          privacy={privacy}
          depth={depth}
          icon_id={icon_id}
          read_only={!!read_only}
          userId={userId}
        />
        <NodeTitle
          nodeStyle={nodeStyle}
          name={name}
          documentId={documentId}
          node_id={node_id}
          index={index}
          tags={tags}
        />
        <NodeOverlay
          clickTimestamp={clickTimestamp}
          nodeComponentRef={componentRef}
          node_id={node_id}
        />
      </div>

      {showChildren && (
        <NodeChildren
          nodes={nodes}
          child_nodes={child_nodes}
          depth={depth}
          documentPrivacy={documentPrivacy}
          node_id={node_id}
          parentPrivacy={parentPrivacy}
          privacy={privacy}
          expand={expand}
          fatherState={fatherState && fatherState[node_id]}
          filteredNodes={filteredNodes}
          documentId={documentId}
        />
      )}
    </>
  );
};

export { Node };

import nodeMod from '::sass-modules/tree/node.scss';
import * as React from 'react';
import { useRef } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useDnDNodes } from '::root/components/app/components/editor/document/components/tree/components/node/hooks/dnd-nodes';
import { useSelectNode } from '::root/components/app/components/editor/document/components/tree/components/node/hooks/select-node';
import { NodePrivacy, Privacy } from '::types/graphql/generated';
import { NodeIcon } from '::root/components/app/components/editor/document/components/tree/components/node/components/node-icon';
import { ToggleChildren } from '::root/components/app/components/editor/document/components/tree/components/node/components/toggle-children';
import { NodeVisibilityIcon } from '::root/components/app/components/editor/document/components/tree/components/node/components/visibility-icon';
import { NodeOverlay } from '::root/components/app/components/editor/document/components/tree/components/node/components/node-overlay';
import { NodeChildren } from '::root/components/app/components/editor/document/components/tree/components/node/components/node-children';
import { NodesDict } from '::store/ducks/cache/document-cache';
import { NodeState } from '::store/ducks/cache/document-cache/helpers/node/expand-node/helpers/tree/tree';
import { FilteredNodes } from '::store/epics/filter-tree/helpers/filter-tree/filter-tree';
import { NodeTitle } from '::root/components/app/components/editor/document/components/tree/components/node/components/node-title';

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
}) => {
  const { child_nodes, name, privacy } = nodes[node_id];
  const match = useRouteMatch<{ file_id: string }>();
  const { file_id } = match.params;
  const componentRef = useRef();
  const listRef = useRef();
  const titleRef = useRef();

  const showChildren =
    expand > depth || !!(fatherState && fatherState[node_id]);

  const { clickTimestamp, selectNode } = useSelectNode({
    file_id,
    node_id,
  });

  const nodeDndProps = useDnDNodes({
    node_id,
    componentRef: titleRef,
    nodes,
  });
  const listDndProps = useDnDNodes({
    componentRef: listRef,
    nodes,
    node_id,
    draggable: false,
  });
  const nodeStyle = JSON.parse(node_title_styles || '{}');
  if (!nodeStyle.color) nodeStyle.color = '#ffffff';
  const icon_id = +nodeStyle.icon_id;
  return (
    <>
      <div
        className={`${nodeMod.node}`}
        ref={componentRef}
        onClick={selectNode}
        draggable={true}
        onDragStart={nodeDndProps.onDragStart}
      >
        <ToggleChildren
          depth={depth}
          child_nodes={child_nodes}
          showChildren={showChildren}
          node_id={node_id}
          documentId={file_id}
        />
        <NodeIcon depth={depth} icon_id={icon_id} />
        <NodeVisibilityIcon
          documentPrivacy={documentPrivacy}
          parentPrivacy={parentPrivacy}
          privacy={privacy}
        />
        <NodeTitle
          nodeDndProps={nodeDndProps}
          nodeStyle={nodeStyle}
          titleRef={titleRef}
          name={name}
          documentId={file_id}
          node_id={node_id}
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
          listDndProps={listDndProps}
          listRef={listRef}
          nodeDndProps={nodeDndProps}
          parentPrivacy={parentPrivacy}
          privacy={privacy}
          expand={expand}
          fatherState={fatherState && fatherState[node_id]}
          filteredNodes={filteredNodes}
        />
      )}
    </>
  );
};

export { Node };

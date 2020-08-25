import nodeMod from '::sass-modules/tree/node.scss';
import * as React from 'react';
import { useCallback, useRef, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useDnDNodes } from '::root/components/app/components/editor/document/components/tree/components/node/hooks/dnd-nodes';
import { useSelectNode } from '::root/components/app/components/editor/document/components/tree/components/node/hooks/select-node';
import { persistedTreeState } from '::root/components/app/components/editor/document/components/tree/components/node/hooks/persisted-tree-state/helpers';
import { usePersistedTreeState } from '::root/components/app/components/editor/document/components/tree/components/node/hooks/persisted-tree-state/persisted-tree-state';
import { NodePrivacy, Privacy } from '::types/graphql/generated';
import { NodeIcon } from '::root/components/app/components/editor/document/components/tree/components/node/components/node-icon';
import { ToggleChildren } from '::root/components/app/components/editor/document/components/tree/components/node/components/toggle-children';
import { NodeVisibilityIcon } from '::root/components/app/components/editor/document/components/tree/components/node/components/visibility-icon';
import { NodeOverlay } from '::root/components/app/components/editor/document/components/tree/components/node/components/node-overlay';
import { NodeChildren } from '::root/components/app/components/editor/document/components/tree/components/node/components/node-children';
import { NodesDict } from '::store/ducks/cache/document-cache';

export type NodeProps = {
  node_id: number;
  nodes?: NodesDict;
  depth: number;
  node_title_styles: string;
  documentPrivacy: Privacy;
  parentPrivacy: NodePrivacy;
  expand?: number;
};

const Node: React.FC<NodeProps> = ({
  node_id,
  nodes,
  depth,
  node_title_styles = '{}',
  documentPrivacy,
  parentPrivacy,
  expand,
}) => {
  const { child_nodes, name, privacy } = nodes[node_id];
  const match = useRouteMatch<{ file_id: string }>();
  const { file_id } = match.params;
  const nodePath = `/document/${file_id}/node/${node_id}`;
  const componentRef = useRef();
  const listRef = useRef();
  const titleRef = useRef();

  const [showChildren, setShowChildren] = useState(() => {
    const tree = persistedTreeState.get(file_id);
    return (
      expand > depth || tree[node_id] || file_id.startsWith('new-document')
    );
  });
  const toggleChildren = useCallback(() => {
    setShowChildren(!showChildren);
  }, [showChildren]);
  const { clickTimestamp, selectNode } = useSelectNode({
    file_id,
    node_id,
  });
  usePersistedTreeState({
    showChildren,
    node_id,
    file_id,
    nodes,
  });
  const nodeDndProps = useDnDNodes({
    node_id,
    componentRef: titleRef,
    nodes,
    afterDrop: ({ node_id }) => {
      selectNode({ node_id, file_id });
      setShowChildren(true);
    },
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
          toggleChildren={toggleChildren}
          child_nodes={child_nodes}
          showChildren={showChildren}
        />
        <NodeIcon depth={depth} icon_id={icon_id} />
        <NodeVisibilityIcon
          documentPrivacy={documentPrivacy}
          parentPrivacy={parentPrivacy}
          privacy={privacy}
        />
        <div
          className={nodeMod.node__title}
          style={{ ...nodeStyle }}
          ref={titleRef}
          {...nodeDndProps}
        >
          {name}
        </div>
        <NodeOverlay
          nodePath={nodePath}
          clickTimestamp={clickTimestamp}
          nodeComponentRef={componentRef}
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
        />
      )}
    </>
  );
};

export { Node };

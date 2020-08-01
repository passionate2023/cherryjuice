import nodeMod from '::sass-modules/tree/node.scss';
import * as React from 'react';
import { useCallback, useRef, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useDnDNodes } from '::app/editor/document/tree/node/hooks/dnd-nodes';
import { useSelectNode } from '::app/editor/document/tree/node/hooks/select-node';
import { useScrollNodeIntoView } from '::app/editor/document/tree/node/hooks/scroll-node-into-view';
import { persistedTreeState } from '::app/editor/document/tree/node/hooks/persisted-tree-state/helpers';
import { usePersistedTreeState } from '::app/editor/document/tree/node/hooks/persisted-tree-state/persisted-tree-state';
import { nodesMetaMap } from '::types/misc';
import { NodePrivacy, Privacy } from '::types/graphql/generated';
import { NodeIcon } from '::app/editor/document/tree/node/components/node-icon';
import { ToggleChildren } from '::app/editor/document/tree/node/components/toggle-children';
import { NodeVisibilityIcon } from '::app/editor/document/tree/node/components/visibility-icon';
import { NodeOverlay } from '::app/editor/document/tree/node/components/node-overlay';
import { NodeChildren } from '::app/editor/document/tree/node/components/node-children';

export type NodeProps = {
  node_id: number;
  nodes?: nodesMetaMap;
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
  const { child_nodes, name, privacy } = nodes.get(node_id);
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
    componentRef,
    file_id,
    node_id,
  });
  useScrollNodeIntoView({ nodePath, componentRef });
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
    afterDrop: ({ e }) => {
      selectNode(e);
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
        <NodeOverlay nodePath={nodePath} clickTimestamp={clickTimestamp} />
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

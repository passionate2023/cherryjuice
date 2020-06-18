import nodeMod from '::sass-modules/tree/node.scss';
import modIcons from '::sass-modules/tree/node.scss';
import { NodeMeta } from '::types/graphql/adapters';
import * as React from 'react';
import { useCallback, useRef, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { Icon, ICON_GROUP, ICON_SIZE, Icons } from '::shared-components/icon';
import { useDnDNodes } from '::app/editor/document/tree/node/hooks/dnd-nodes';
import { useSelectNode } from '::app/editor/document/tree/node/hooks/select-node';
import { useScrollNodeIntoView } from '::app/editor/document/tree/node/hooks/scroll-node-into-view';
import { persistedTreeState } from '::app/editor/document/tree/node/hooks/persisted-tree-state/helpers';
import { usePersistedTreeState } from '::app/editor/document/tree/node/hooks/persisted-tree-state/persisted-tree-state';

type Props = {
  node_id: number;
  nodes?: Map<number, NodeMeta>;
  depth: number;
  node_title_styles: string;
  icon_id: string;
};

const Node: React.FC<Props> = ({
  node_id,
  nodes,
  depth,
  node_title_styles,
  icon_id,
}) => {
  const { child_nodes, name } = nodes.get(node_id);
  const match = useRouteMatch<{ file_id: string }>();
  const { file_id } = match.params;
  const nodePath = `/document/${file_id}/node/${node_id}`;
  const componentRef = useRef();
  const listRef = useRef();
  const titleRef = useRef();

  const [showChildren, setShowChildren] = useState(() => {
    const tree = persistedTreeState.get(file_id);
    return tree[node_id] || file_id.startsWith('new-document');
  });
  const toggleChildren = useCallback(() => {
    setShowChildren(!showChildren);
  }, [showChildren]);
  const selectNode = useSelectNode({
    nodePath,
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
  return (
    <>
      <div
        className={`${nodeMod.node}`}
        ref={componentRef}
        onClick={selectNode}
        draggable={true}
        onDragStart={nodeDndProps.onDragStart}
      >
        <div style={{ marginLeft: depth * 20 }} />
        {
          <Icon
            svg={{
              name: showChildren ? Icons.material.remove : Icons.material.add,
              size: ICON_SIZE._24,
            }}
            containerAttributes={{
              class: `${nodeMod.node__titleButton} ${
                child_nodes.length > 0 ? '' : nodeMod.node__titleButtonHidden
              }`,
            }}
            svgAttributes={{
              width: '8px',
              height: '8px',
            }}
            onClick={toggleChildren}
          />
        }
        <Icon
          svg={{
            name: +icon_id
              ? Icons.cherrytree.custom_icons[icon_id]
              : Icons.cherrytree.cherries[depth >= 11 ? 11 : depth],
            group: ICON_GROUP.cherrytree,
          }}
          containerAttributes={{
            className: modIcons.node__titleCherry,
          }}
          svgAttributes={{ width: '14px', height: '14px' }}
          testId={'cherry' + icon_id}
        />
        <div
          className={nodeMod.node__title}
          style={{ ...(node_title_styles && JSON.parse(node_title_styles)) }}
          ref={titleRef}
          {...nodeDndProps}
        >
          {name}
        </div>
        {location.pathname === nodePath && (
          <div className={nodeMod.node__titleOverlay} />
        )}
      </div>
      {showChildren && (
        <ul
          className={nodeMod.node__list}
          {...{
            ...nodeDndProps,
            onDrop: listDndProps.onDrop,
            draggable: listDndProps.draggable,
            onDragStart: listDndProps.onDragStart,
          }}
          ref={listRef}
        >
          {child_nodes
            .map(node_id => nodes.get(node_id))
            .map(node => (
              <Node
                key={node.node_id}
                node_id={node.node_id}
                nodes={nodes}
                depth={depth + 1}
                icon_id={node.icon_id}
                node_title_styles={node.node_title_styles}
              />
            ))}
        </ul>
      )}
    </>
  );
};

export { Node };

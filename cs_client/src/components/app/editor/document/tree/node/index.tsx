import nodeMod from '::sass-modules/tree/node.scss';
import modIcons from '::sass-modules/tree/node.scss';
import { NodeMeta } from '::types/graphql/adapters';
import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { getTreeStateFromLocalStorage } from '::helpers/misc';
import { Icon, ICON_SIZE, Icons } from '::shared-components/icon';
import { nodeOverlay } from './helpers/node-overlay';
import { scrollIntoToolbar } from '::helpers/ui';
import { updateCachedHtmlAndImages } from '::app/editor/document/tree/node/helpers/apollo-cache';
import { useContext } from 'react';
import { RootContext } from '::root/root-context';
import { useDnDNodes } from '::app/editor/document/tree/node/hooks/dnd-nodes';

type Props = {
  node_id: number;
  nodes?: Map<number, NodeMeta>;
  depth: number;
  styles: string;
  icon_id: string;
};

const collapseAll = (ids: number[], treeState: any, nodes: any) => {
  ids.forEach(id => {
    delete treeState[id];
    collapseAll(nodes.get(id).child_nodes, treeState, nodes);
  });
};

const Node: React.FC<Props> = ({ node_id, nodes, depth, styles, icon_id }) => {
  const { child_nodes, name } = nodes.get(node_id);

  // misc hooks
  const history = useHistory();
  const match = useRouteMatch();
  //@ts-ignore
  const { file_id } = match.params;
  const nodePath = `/document/${file_id}/node/${node_id}`;
  // state and ref hook
  const [showChildren, setShowChildren] = useState(
    () => getTreeStateFromLocalStorage()[node_id],
  );
  const componentRef = useRef();
  const listRef = useRef();
  const titleRef = useRef();
  // callback hooks
  const {
    apolloClient: { cache },
  } = useContext(RootContext);
  const selectNode = useCallback(
    (e, path = nodePath) => {
      const eventIsTriggeredByCollapseButton = e.target.classList.contains(
        nodeMod.node__titleButton,
      );
      if (eventIsTriggeredByCollapseButton) return;
      nodeOverlay.updateWidth();
      nodeOverlay.updateLeft(componentRef);

      updateCachedHtmlAndImages();
      history.push(path);
    },
    [nodePath],
  );
  const toggleChildren = useCallback(() => {
    setShowChildren(!showChildren);
  }, [showChildren]);

  // use-effect hooks
  useEffect(() => {
    if (location.pathname === nodePath) {
      nodeOverlay.updateLeft(componentRef);
      // @ts-ignore
      componentRef?.current?.scrollIntoView();
      // --
      scrollIntoToolbar();
      // --
    }
  }, []);
  useEffect(() => {
    const treeState = getTreeStateFromLocalStorage();
    treeState[node_id] = showChildren;
    if (!treeState[node_id]) {
      collapseAll(child_nodes, treeState, nodes);
    }
    localStorage.setItem('treeState', JSON.stringify(treeState));
    nodeOverlay.updateWidth();
  }, [showChildren]);
  // console.log('treeRef', nodeMod.node__titleButtonHidden,child_nodes);
  // @ts-ignore
  const nodeDndProps = useDnDNodes({
    cache,
    componentRef: titleRef,
    nodes,
    node_id,
    afterDrop: ({ e, node_id }) => {
      selectNode(e, `/document/${file_id}/node/${node_id}`);
      setShowChildren(true);
    },
  });
  const listDndProps = useDnDNodes({
    cache,
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
            className={`${nodeMod.node__titleButton} ${
              child_nodes.length > 0 ? '' : nodeMod.node__titleButtonHidden
            }`}
            onClick={toggleChildren}
            name={showChildren ? Icons.material.remove : Icons.material.add}
            size={ICON_SIZE._24}
          />
        }
        <Icon
          name={
            +icon_id
              ? Icons.cherrytree.custom_icons[icon_id]
              : Icons.cherrytree.cherries[depth >= 11 ? 11 : depth]
          }
          className={modIcons.node__titleCherry}
        />
        <div
          className={nodeMod.node__title}
          style={{ ...(styles && JSON.parse(styles)) }}
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
                styles={node.node_title_styles}
              />
            ))}
        </ul>
      )}
    </>
  );
};

export { Node };

import nodeMod from '::sass-modules/tree/node.scss';
import modIcons from '::sass-modules/tree/node.scss';
import { Ct_Node_Meta } from '::types/generated';
import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { appActions } from '::app/reducer';
import { getTreeStateFromLocalStorage } from '::helpers/misc';
import { Icon, Icons } from '::shared-components/icon';

type Props = {
  node_id: number;
  nodes?: Map<number, Ct_Node_Meta>;
  depth: number;
  dispatch: any;
  styles: string;
  icon_id: string;
};

const collapseAll = (ids: number[], treeState: any, nodes: any) => {
  ids.forEach(id => {
    delete treeState[id];
    collapseAll(nodes.get(id).child_nodes, treeState, nodes);
  });
};
const Node: React.FC<Props> = ({
  node_id,
  nodes,
  depth,
  dispatch,
  styles,
  icon_id,
}) => {
  const { child_nodes, name, is_richtxt, ts_creation, ts_lastsave } = nodes.get(
    node_id,
  );

  // misc hooks
  const history = useHistory();
  const match = useRouteMatch();
  //@ts-ignore
  const { file_id } = match.params;
  const nodePath = `/${file_id}/node-${node_id}`;
  // state and ref hook
  const [showChildren, setShowChildren] = useState(
    () => getTreeStateFromLocalStorage()[node_id],
  );
  const componentRef = useRef();
  // callback hooks
  const selectNode = useCallback(() => {
    dispatch({
      type: appActions.SELECT_NODE,
      value: {
        node_id,
        name,
        style: styles,
        is_richtxt,
        ts_creation,
        ts_lastsave,
      },
    });
    history.push(nodePath);
  }, []);
  const toggleChildren = useCallback(() => {
    setShowChildren(!showChildren);
  }, [showChildren]);

  // use-effect hooks
  useEffect(() => {
    if (location.pathname === nodePath) {
      // @ts-ignore
      // componentRef?.current?.scrollIntoView();
      dispatch({
        type: appActions.SELECT_NODE,
        value: {
          node_id,
          name,
          style: styles,
          is_richtxt,
          ts_creation,
          ts_lastsave,
        },
      });
    }
  }, []);
  useEffect(() => {
    const treeState = getTreeStateFromLocalStorage();
    treeState[node_id] = showChildren;
    if (!treeState[node_id]) {
      collapseAll(child_nodes, treeState, nodes);
    }
    localStorage.setItem('treeState', JSON.stringify(treeState));
  }, [showChildren]);
  // console.log('treeRef', nodeMod.node__titleButtonHidden,child_nodes);
  // @ts-ignore
  return (
    <>
      <div className={`${nodeMod.node}`} ref={componentRef}>
        {
          <Icon
            className={`${nodeMod.node__titleButton} ${
              child_nodes.length > 0 ? '' : nodeMod.node__titleButtonHidden
            }`}
            onClick={toggleChildren}
            name={showChildren ? Icons.material.remove : Icons.material.add}
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
          onClick={selectNode}
          style={{ ...(styles && JSON.parse(styles)) }}
        >
          {name}
        </div>
        {location.pathname === nodePath && (
          <div
            className={nodeMod.node__titleOverlay}
            // style={{ width: treeRef?.current?.size?.width + 220 }}
          />
        )}
      </div>
      {showChildren && (
        <ul className={nodeMod.node__list}>
          {child_nodes
            .map(node_id => nodes.get(node_id))
            .map(node => (
              <Node
                key={node.node_id}
                node_id={node.node_id}
                nodes={nodes}
                depth={depth + 1}
                dispatch={dispatch}
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

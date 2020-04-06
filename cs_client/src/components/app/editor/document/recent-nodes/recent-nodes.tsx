import * as React from 'react';
import { useCallback } from 'react';
import { useHistory } from 'react-router';
import { appActionCreators, TRecentNode } from '::app/reducer';
import { modRecentNodes } from '::sass-modules/index';
import { TState } from '::app/reducer';

type Props = {
  state: TState;
  file_id: string;
};
const config = {
  recentNodesN: 4,
};
const RecentNodes: React.FC<Props> = ({
  state: { recentNodes, selectedNode, isOnMobile, showRecentNodes },
  file_id,
}) => {
  let recentNodesOther = recentNodes.filter(
    ({ id }) => +id !== selectedNode.id,
  );
  let lastN: TRecentNode[] = recentNodesOther.slice(
    recentNodesOther.length > config.recentNodesN
      ? recentNodesOther.length - config.recentNodesN
      : 0,
  );
  const history = useHistory();
  const goToNode = useCallback(e => {
    let node_id = e.target.dataset.id;
    let name = e.target.dataset.name;
    let style = e.target.dataset.style;
    let is_richtxt = e.target.dataset.is_richtxt;
    let ts_creation = e.target.dataset.ts_creation;
    let ts_lastsave = e.target.dataset.ts_lastsave;
    appActionCreators.selectNode(
      { node_id, name, style },
      { is_richtxt, ts_lastsave, ts_creation },
    );
    history.push(`/${file_id}/node-${node_id}`);
  }, []);
  return (
    <div className={modRecentNodes.titleAndRecentNodes}>
      {(!isOnMobile || showRecentNodes) && (
        <div className={modRecentNodes.titleAndRecentNodes__recentNodes}>
          {lastN.length ? (
            lastN.map(
              ({ id, name, style, is_richtxt, ts_creation, ts_lastsave }) => {
                return name &&
                  +id !== selectedNode.id && (
                    <button
                      className={
                        modRecentNodes.titleAndRecentNodes__recentNodes__node
                      }
                      data-id={id}
                      data-name={name}
                      data-style={style}
                      data-is_richtxt={is_richtxt}
                      data-ts_creation={ts_creation}
                      data-ts_lastsave={ts_lastsave}
                      onClick={goToNode}
                      key={id}
                      title={name}
                    >
                      {name.substring(0, 10)}
                      {`${name.length > 10 ? '...' : ''}`}
                    </button>
                  );
              },
            )
          ) : isOnMobile ? (
            <div
              className={
                modRecentNodes.titleAndRecentNodes__recentNodes__placeHolder
              }
            >
              no recent nodes
            </div>
          ) : (
            <></>
          )}
        </div>
      )}
      <div
        className={modRecentNodes.titleAndRecentNodes__title}
        style={selectedNode.style}
      >
        {selectedNode.name}
      </div>
    </div>
  );
};

export { RecentNodes };

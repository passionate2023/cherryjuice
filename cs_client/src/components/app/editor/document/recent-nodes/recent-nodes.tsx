import * as React from 'react';
import { useCallback } from 'react';
import { useHistory } from 'react-router';
import { TRecentNode } from '::app/reducer';
import { modRecentNodes } from '::sass-modules/index';
import { TState } from '::app/reducer';
import { updateCacheAfterSwitchingNode } from '::app/editor/document/tree/node/helpers/apollo-cache';
import { useContext } from 'react';
import { RootContext } from '::root/root-context';

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
  const recentNodesOther = recentNodes.filter(
    ({ id }) => +id !== selectedNode.id,
  );
  const lastN: TRecentNode[] = recentNodesOther.slice(
    recentNodesOther.length > config.recentNodesN
      ? recentNodesOther.length - config.recentNodesN
      : 0,
  );
  const {
    apolloClient: { cache },
  } = useContext(RootContext);
  const history = useHistory();
  const goToNode = useCallback(
    e => {
      updateCacheAfterSwitchingNode(cache);
      const node_id = e.target.dataset.id;
      history.push(`/document/${file_id}/node/${node_id}`);
    },
    [file_id],
  );
  return (
    <div className={modRecentNodes.titleAndRecentNodes}>
      {(!isOnMobile || showRecentNodes) && (
        <div className={modRecentNodes.titleAndRecentNodes__recentNodes}>
          {lastN.length ? (
            lastN.map(({ id, name }) => {
              return (
                name &&
                +id !== selectedNode.id && (
                  <button
                    className={
                      modRecentNodes.titleAndRecentNodes__recentNodes__node
                    }
                    data-id={id}
                    onClick={goToNode}
                    key={id}
                  >
                    {name.substring(0, 10)}
                    {`${name.length > 10 ? '...' : ''}`}
                  </button>
                )
              );
            })
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

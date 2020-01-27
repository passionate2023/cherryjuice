import modRecentNodes from '::sass-modules/recent-nodes.scss';
import * as React from 'react';
import { useCallback } from 'react';
import { useHistory } from 'react-router';
import { appActions } from '::app/reducer';

type Props = {
  recentNodes: { id: string; name: string }[];
  selectedNode: { id: number; name: string };
  dispatch: any;
};
const config = {
  recentNodesN: 4
};
const RecentNodes: React.FC<Props> = ({
  recentNodes,
  selectedNode,
  dispatch
}) => {
  let recentNodesOther = recentNodes.filter(({ id }) => +id !== selectedNode.id);
  let lastN = recentNodesOther.slice(
    recentNodesOther.length > config.recentNodesN
      ? recentNodesOther.length - config.recentNodesN
      : 0
  );
  const history = useHistory();
  const goToNode = useCallback(e => {
    let node_id = e.target.dataset.id;
    let name = e.target.dataset.name;
    dispatch({ type: appActions.SELECT_NODE, value: { node_id, name } });

    history.push(`/node-${node_id}`);
  }, []);
  return (
    <div className={modRecentNodes.recentNodes}>
      <div className={modRecentNodes.recentNodes__buttonsContainer}>
        {lastN.map(
          ({ id, name }) =>
            name &&
            +id !== selectedNode.id && (
              <button
                className={modRecentNodes.recentNodes__button}
                data-id={id}
                data-name={name}
                onClick={goToNode}
                key={id}
                title={name}
              >
                {name.substring(0, 10)}
                {`${name.length > 10 ? '...' : ''}`}
              </button>
            )
        )}
      </div>
      <p className={modRecentNodes.recentNodes__title}>{selectedNode.name}</p>
    </div>
  );
};

export { RecentNodes };

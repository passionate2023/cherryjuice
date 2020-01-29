import modRecentNodes from '::sass-modules/recent-nodes.scss';
import * as React from 'react';
import { useCallback } from 'react';
import { useHistory } from 'react-router';
import { appActions } from '::app/reducer';

type Props = {
  recentNodes: { id: string; name: string; style: any }[];
  selectedNode: { id: number; name: string; style: any };
  dispatch: any;
  file_id: string;
};
const config = {
  recentNodesN: 4
};
const RecentNodes: React.FC<Props> = ({
  recentNodes,
  selectedNode,
  dispatch,
  file_id
}) => {
  let recentNodesOther = recentNodes.filter(
    ({ id }) => +id !== selectedNode.id
  );
  let lastN = recentNodesOther.slice(
    recentNodesOther.length > config.recentNodesN
      ? recentNodesOther.length - config.recentNodesN
      : 0
  );
  const history = useHistory();
  const goToNode = useCallback(e => {
    let node_id = e.target.dataset.id;
    let name = e.target.dataset.name;
    let style = e.target.dataset.style;
    dispatch({ type: appActions.SELECT_NODE, value: { node_id, name, style } });
    history.push(`/${file_id}/node-${node_id}`);
  }, []);
  return (
    <div className={modRecentNodes.recentNodes}>
      <div className={modRecentNodes.recentNodes__buttonsContainer}>
        {lastN.map(
          ({ id, name, style }) =>
            name &&
            +id !== selectedNode.id && (
              <button
                className={modRecentNodes.recentNodes__button}
                data-id={id}
                data-name={name}
                data-style={style}
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
      <p
        className={modRecentNodes.recentNodes__title}
        style={selectedNode.style}
      >
        {selectedNode.name}
      </p>
    </div>
  );
};

export { RecentNodes };

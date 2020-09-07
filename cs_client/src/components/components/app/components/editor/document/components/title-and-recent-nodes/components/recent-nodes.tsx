import * as React from 'react';
import { modRecentNodes } from '::sass-modules';
import { useCallback } from 'react';
import { updateCachedHtmlAndImages } from '::root/components/app/components/editor/document/components/tree/components/node/helpers/apollo-cache';
import { ac } from '::store/store';
import { NodesDict, QFullNode } from '::store/ducks/cache/document-cache';

const config = {
  recentNodesN: 4,
};

const getLastN = (
  recentNodes: number[],
  selectedNode_id: number,
  nodes: NodesDict,
  isOnMd: boolean,
): QFullNode[] => {
  const recentNodesOther = recentNodes.filter(
    node_id => +node_id !== selectedNode_id,
  );
  const limit = isOnMd ? 20 : config.recentNodesN;
  return recentNodesOther
    .slice(
      recentNodesOther.length > limit ? recentNodesOther.length - limit : 0,
    )
    .map(node_id => nodes[node_id])
    .filter(Boolean)
    .reverse();
};

type Props = {
  documentId: string;
  recentNodes: number[];
  selectedNode_id: number;
  isOnMd: boolean;
  nodes: NodesDict;
};

const RecentNodes: React.FC<Props> = ({
  isOnMd,
  selectedNode_id,
  documentId,
  recentNodes,
  nodes,
}) => {
  const goToNode = useCallback(
    e => {
      updateCachedHtmlAndImages();
      const node_id = +e.target.dataset.id;
      ac.node.select({ documentId, node_id });
    },
    [documentId],
  );

  const lastN = getLastN(recentNodes, selectedNode_id, nodes, isOnMd);
  return (
    <div className={modRecentNodes.titleAndRecentNodes__recentNodes}>
      {lastN.map(({ node_id, name }) => (
        <button
          className={modRecentNodes.titleAndRecentNodes__recentNodes__node}
          data-id={node_id}
          onClick={goToNode}
          key={node_id}
        >
          {name.substring(0, 10)}
          {`${name.length > 10 ? '...' : ''}`}
        </button>
      ))}
    </div>
  );
};

export { RecentNodes };

import * as React from 'react';
import { useCallback } from 'react';
import { modRecentNodes } from '::sass-modules/index';
import { updateCachedHtmlAndImages } from '::app/editor/document/tree/node/helpers/apollo-cache';
import { router } from '::root/router/router';
import { NodeMeta } from '::types/graphql/adapters';
import { nodesMetaMap } from '::types/misc';

type Props = {
  recentNodes: number[];
  selectedNode_id: number;
  nodes: nodesMetaMap;
  file_id: string;
  isOnMobile: boolean;
  showRecentNodes: boolean;
};
const config = {
  recentNodesN: 4,
};
const RecentNodes: React.FC<Props> = ({
  isOnMobile,
  showRecentNodes,
  file_id,
  recentNodes,
  selectedNode_id,
  nodes,
}) => {
  const selectedNode = nodes.get(selectedNode_id);
  const recentNodesOther = recentNodes.filter(
    node_id => +node_id !== selectedNode.node_id,
  );
  const lastN: NodeMeta[] = recentNodesOther
    .slice(
      recentNodesOther.length > config.recentNodesN
        ? recentNodesOther.length - config.recentNodesN
        : 0,
    )
    .map(node_id => nodes.get(node_id));

  const goToNode = useCallback(
    e => {
      updateCachedHtmlAndImages();
      const node_id = e.target.dataset.id;
      router.node(file_id, node_id);
    },
    [file_id],
  );
  return (
    <div className={modRecentNodes.titleAndRecentNodes}>
      {(!isOnMobile || showRecentNodes) && (
        <div className={modRecentNodes.titleAndRecentNodes__recentNodes}>
          {lastN.length ? (
            lastN.map(({ node_id, name }) => {
              return (
                name &&
                node_id !== selectedNode.node_id && (
                  <button
                    className={
                      modRecentNodes.titleAndRecentNodes__recentNodes__node
                    }
                    data-id={node_id}
                    onClick={goToNode}
                    key={node_id}
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
        style={{
          ...(selectedNode.node_title_styles &&
            JSON.parse(selectedNode.node_title_styles)),
        }}
      >
        {selectedNode.name}
      </div>
    </div>
  );
};
export { RecentNodes };

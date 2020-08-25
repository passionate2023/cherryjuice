import * as React from 'react';
import { useCallback } from 'react';
import { modRecentNodes } from '::sass-modules';
import { updateCachedHtmlAndImages } from '::root/components/app/components/editor/document/components/tree/components/node/helpers/apollo-cache';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::store/store';
import { NodesDict, QFullNode } from '::store/ducks/cache/document-cache';

const mapState = (state: Store) => ({
  isOnMobile: state.root.isOnMobile,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {
  recentNodes: number[];
  selectedNode_id: number;
  nodes: NodesDict;
  file_id: string;
  showRecentNodes: boolean;
};
const config = {
  recentNodesN: 4,
};
const RecentNodes: React.FC<Props & PropsFromRedux> = ({
  isOnMobile,
  showRecentNodes,
  file_id,
  recentNodes,
  selectedNode_id,
  nodes,
}) => {
  const goToNode = useCallback(
    e => {
      updateCachedHtmlAndImages();
      const node_id = +e.target.dataset.id;
      ac.node.select({ documentId: file_id, node_id });
    },
    [file_id],
  );
  const selectedNode = nodes[selectedNode_id];
  if (!selectedNode) return <></>;
  const recentNodesOther = recentNodes.filter(
    node_id => +node_id !== selectedNode?.node_id,
  );
  const lastN: QFullNode[] = recentNodesOther
    .slice(
      recentNodesOther.length > config.recentNodesN
        ? recentNodesOther.length - config.recentNodesN
        : 0,
    )
    .map(node_id => nodes[node_id])
    .filter(Boolean);

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
const _ = connector(RecentNodes);
export { _ as RecentNodes };

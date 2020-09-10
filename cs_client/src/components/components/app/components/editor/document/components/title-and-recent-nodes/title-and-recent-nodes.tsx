import * as React from 'react';
import { appModule, modRecentNodes } from '::sass-modules';
import { Title } from '::root/components/app/components/editor/document/components/title-and-recent-nodes/components/title';
import { Store } from '::store/store';
import { connect, ConnectedProps } from 'react-redux';
import { getCurrentDocument } from '::store/selectors/cache/document/document';
import { RecentNodes } from '::root/components/app/components/editor/document/components/title-and-recent-nodes/components/recent-nodes';
import { Portal } from '::root/components/app/components/editor/tool-bar/tool-bar';

const mapState = (state: Store) => {
  const document = getCurrentDocument(state);
  return {
    isOnMd: state.root.isOnMd,
    docking: state.root.docking,
    showRecentNodes: state.editor.showRecentNodesBar,
    nodes: document?.nodes,
    selectedNode_id: document?.persistedState?.selectedNode_id,
    recentNodes: document?.persistedState?.recentNodes,
    documentId: document?.id,
  };
};
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};

const TitleAndRecentNodes: React.FC<Props & PropsFromRedux> = ({
  nodes,
  selectedNode_id,
  recentNodes,
  documentId,
  showRecentNodes,
  isOnMd,
  docking,
}) => {
  const node = nodes[selectedNode_id];
  if (!node) return <></>;
  return (
    <div className={modRecentNodes.titleAndRecentNodes}>
      {(!isOnMd || (!docking && showRecentNodes)) && (
        <Portal targetSelector={'.' + appModule.app} predicate={isOnMd}>
          <RecentNodes
            documentId={documentId}
            nodes={nodes}
            recentNodes={recentNodes}
            selectedNode_id={selectedNode_id}
            isOnMd={isOnMd}
          />
        </Portal>
      )}
      <Title name={node.name} node_title_styles={node.node_title_styles} />
    </div>
  );
};

const _ = connector(TitleAndRecentNodes);
export { _ as TitleAndRecentNodes };

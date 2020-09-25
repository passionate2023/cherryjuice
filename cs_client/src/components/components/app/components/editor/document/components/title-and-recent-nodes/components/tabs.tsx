import * as React from 'react';
import { modTabs } from '::sass-modules';
import { forwardRef } from 'react';
import { NodesDict } from '::store/ducks/cache/document-cache';
import { Tab } from '::root/components/app/components/editor/document/components/title-and-recent-nodes/components/components/tab';

type Props = {
  documentId: string;
  recentNodes: number[];
  selectedNode_id: number;
  nodes: NodesDict;
  isOnMd: boolean;
};

const Tabs: React.FC<Props> = (
  { selectedNode_id, recentNodes, nodes, isOnMd },
  tabsR,
) => {
  return (
    <div className={modTabs.tabs} ref={tabsR}>
      {recentNodes
        .map(node_id => nodes[node_id])
        .map(({ node_id, name, documentId }) => (
          <Tab
            name={name}
            node_id={node_id}
            documentId={documentId}
            key={node_id}
            isSelected={selectedNode_id === node_id}
            isOnMd={isOnMd}
          />
        ))}
    </div>
  );
};

const _ = forwardRef(Tabs);

export { _ as Tabs };

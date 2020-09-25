import * as React from 'react';
import { modTabs } from '::sass-modules';
import { forwardRef } from 'react';
import {
  NodeProps,
  Tab,
} from '::root/components/app/components/editor/document/components/title-and-recent-nodes/components/components/tab';

type Props = {
  documentId: string;
  selectedNode_id: number;
  nodes: NodeProps[];
  isOnMd: boolean;
};

const Tabs: React.FC<Props> = (
  { selectedNode_id, nodes, isOnMd, documentId },
  tabsR,
) => {
  return (
    <div className={modTabs.tabs} ref={tabsR}>
      {nodes.map(({ node_id, name, hasChanges }) => (
        <Tab
          name={name}
          node_id={node_id}
          documentId={documentId}
          key={node_id}
          isSelected={selectedNode_id === node_id}
          isOnMd={isOnMd}
          hasChanges={hasChanges}
        />
      ))}
    </div>
  );
};

const _ = forwardRef(Tabs);

export { _ as Tabs };

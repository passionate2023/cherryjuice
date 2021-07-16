import * as React from 'react';
import { modTabs } from '::sass-modules';
import { NodeProps, Tab } from './components/tab';

export type TabsProps = {
  documentId: string;
  nodes: NodeProps[];
  isOnMd: boolean;
};

const Tabs: React.FC<TabsProps> = ({ nodes, isOnMd, documentId }) => {
  return (
    <div className={modTabs.tabs}>
      {nodes.map(props => (
        <Tab
          documentId={documentId}
          {...props}
          key={props.node_id}
          isOnMd={isOnMd}
        />
      ))}
    </div>
  );
};

export { Tabs };

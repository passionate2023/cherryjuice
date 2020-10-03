import * as React from 'react';
import { modTabs } from '::sass-modules';
import { forwardRef } from 'react';
import {
  NodeProps,
  Tab,
} from '::root/components/app/components/editor/document/components/title-and-recent-nodes/components/components/tab';

type Props = {
  documentId: string;
  nodes: NodeProps[];
  isOnMd: boolean;
};

const Tabs: React.FC<Props> = ({ nodes, isOnMd, documentId }, tabsR) => {
  return (
    <div className={modTabs.tabs} ref={tabsR}>
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

const _ = forwardRef(Tabs);

export { _ as Tabs };

import * as React from 'react';
import { modTabs } from '::sass-modules';
import { forwardRef } from 'react';
import { NodeProps, Tab } from './components/tab';

type Props = {
  documentId: string;
  nodes: NodeProps[];
  isOnMd: boolean;
  onContextMenu: () => void;
};

const Tabs: React.FC<Props> = (
  { nodes, isOnMd, documentId, onContextMenu },
  tabsR,
) => {
  return (
    <div className={modTabs.tabsList} ref={tabsR} onContextMenu={onContextMenu}>
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

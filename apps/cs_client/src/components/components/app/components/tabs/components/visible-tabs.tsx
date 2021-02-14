import * as React from 'react';
import { modTabs } from '::sass-modules';
import { MouseEvent } from 'react';
import { NodeProps, Tab } from './components/tab';

type Props = {
  documentId: string;
  nodes: NodeProps[];
  isOnMd: boolean;
  onContextMenu: (e: MouseEvent<HTMLDivElement>) => void;
  indexOfSelectedTab: number;
};

const VisibleTabs: React.FC<Props> = ({
  nodes,
  isOnMd,
  documentId,
  onContextMenu,
  indexOfSelectedTab,
  children,
}) => {
  return (
    <div className={modTabs.tabsList} onContextMenu={onContextMenu}>
      {nodes.map((props, i) => {
        const notSelected = indexOfSelectedTab !== i;
        const nextTabIsSelected = i + 1 === indexOfSelectedTab;
        const previousTabIsSelected = i - 1 === indexOfSelectedTab;
        const showLeftSeparator =
          i > 0 && notSelected && !previousTabIsSelected;
        const showRightSeparator =
          i < nodes.length - 1 && notSelected && !nextTabIsSelected;
        return (
          <React.Fragment key={props.node_id}>
            <Tab
              documentId={documentId}
              {...props}
              isOnMd={isOnMd}
              showLeftSeparator={showLeftSeparator}
              showRightSeparator={showRightSeparator}
            />
          </React.Fragment>
        );
      })}
      {children}
    </div>
  );
};

export { VisibleTabs };

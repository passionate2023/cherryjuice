import * as React from 'react';
import { modTabs } from '::sass-modules';
import { MouseEvent } from 'react';
import { NodeProps, Tab } from './components/tab';
import { Separator } from '::app/components/editor/tool-bar/components/separator';

type Props = {
  documentId: string;
  nodes: NodeProps[];
  isOnMd: boolean;
  onContextMenu: (e: MouseEvent<HTMLDivElement>) => void;
  indexOfSelectedTab: number;
};

const Tabs: React.FC<Props> = ({
  nodes,
  isOnMd,
  documentId,
  onContextMenu,
  indexOfSelectedTab,
}) => {
  return (
    <div className={modTabs.tabsList} onContextMenu={onContextMenu}>
      {nodes.map((props, i) => {
        const showSeparator =
          i > 0 && indexOfSelectedTab !== i && indexOfSelectedTab !== i - 1;
        return (
          <React.Fragment key={props.node_id}>
            {showSeparator && <Separator />}
            <Tab documentId={documentId} {...props} isOnMd={isOnMd} />
          </React.Fragment>
        );
      })}
    </div>
  );
};

export { Tabs };

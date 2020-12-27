import * as React from 'react';
import { modTabs } from '::sass-modules';
import {
  NodeProps,
  Tab,
} from '::root/components/app/components/editor/document/components/title-and-recent-nodes/components/components/tab';
import { ButtonSquare } from '@cherryjuice/components';
import { Icon, Icons } from '@cherryjuice/icons';
import { ContextMenuWrapper } from '::root/components/shared-components/context-menu/context-menu-wrapper';

type Props = {
  nodes: NodeProps[];
  documentId: string;
  shown: boolean;
  showContextMenu: () => void;
  hideContextMenu: () => void;
};

const HiddenTabs: React.FC<Props> = ({
  nodes,
  documentId,
  shown,
  showContextMenu,
  hideContextMenu,
}) => {
  return (
    <ContextMenuWrapper
      show={showContextMenu}
      shown={shown}
      hide={hideContextMenu}
      customBody={
        <div className={modTabs.tabsHidden}>
          {nodes.map(props => (
            <Tab key={props.node_id} documentId={documentId} {...props} />
          ))}
        </div>
      }
    >
      <ButtonSquare
        icon={<Icon name={Icons.material['arrow-down']} size={15} />}
        className={modTabs.hiddenTabsButton}
      />
    </ContextMenuWrapper>
  );
};

export { HiddenTabs };

import * as React from 'react';
import { modTabs } from '::sass-modules';
import { Tab } from '::root/components/app/components/editor/document/components/title-and-recent-nodes/components/components/tab';
import { ButtonSquare } from '::root/components/shared-components/buttons/button-square/button-square';
import { Icon, Icons } from '::root/components/shared-components/icon/icon';
import { ContextMenuWrapper } from '::root/components/shared-components/context-menu/context-menu-wrapper';
import { QFullNode } from '::store/ducks/cache/document-cache';

type Props = {
  tabs: Pick<QFullNode, 'name' | 'node_id'>[];
  documentId: string;
  shown: boolean;
  showContextMenu: () => void;
  hideContextMenu: () => void;
};

const HiddenTabs: React.FC<Props> = ({
  tabs,
  documentId,
  shown,
  showContextMenu,
  hideContextMenu,
}) => {
  return (
    <ContextMenuWrapper
      alignTo={'right'}
      show={shown}
      hide={hideContextMenu}
      contextMenu={
        <div className={modTabs.tabsHidden}>
          {tabs.map(({ node_id, name }) => (
            <Tab
              key={node_id}
              documentId={documentId}
              name={name}
              node_id={node_id}
            />
          ))}
        </div>
      }
    >
      <ButtonSquare
        onClick={showContextMenu}
        icon={<Icon name={Icons.material['arrow-down']} size={15} />}
        className={modTabs.hiddenTabsButton}
      />
    </ContextMenuWrapper>
  );
};

export { HiddenTabs };

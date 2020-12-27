import * as React from 'react';
import { modTabs } from '::sass-modules';
import {
  Tabs,
  TabsProps,
} from '::root/app/components/editor/components/tabs/tabs';

type Props = TabsProps;
export const TabsContainer: React.FC<Props> = ({ documentId, nodes }) => {
  return (
    <div className={modTabs.tabsContainer}>
      <Tabs documentId={documentId} isOnMd={false} nodes={nodes} />
    </div>
  );
};

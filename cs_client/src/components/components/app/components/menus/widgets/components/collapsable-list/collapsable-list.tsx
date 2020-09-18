import * as React from 'react';
import {
  Header,
  HeaderProps,
} from '::root/components/app/components/menus/widgets/components/collapsable-list/components/header/header';
import {
  ListBody,
  ListBodyProps,
} from '::root/components/app/components/menus/widgets/components/collapsable-list/components/body/list-body';
import { modDocumentOperations } from '::sass-modules';
import { useEffect, useRef, useState } from 'react';

import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::store/store';

const mapState = (state: Store) => ({
  dialogIsOpen:
    state.root.isOnMd &&
    (state.dialogs.showDocumentList ||
      state.dialogs.showSettingsDialog ||
      state.dialogs.showDocumentMetaDialog ||
      state.search.searchState !== 'idle' ||
      state.dialogs.showNodeMetaDialog),
});
const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;

type CollapsableListProps = Omit<
  HeaderProps & ListBodyProps,
  'collapsed' | 'toggleCollapsed'
>;

const CollapsableList: React.FC<CollapsableListProps & PropsFromRedux> = ({
  items,
  text,
  additionalHeaderButtons,
  dialogIsOpen,
}) => {
  const ref = useRef<HTMLDivElement>();
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => void setCollapsed(!collapsed);
  useEffect(() => {
    if (dialogIsOpen) setCollapsed(true);
  }, [dialogIsOpen]);

  useEffect(() => {
    const parentElement = ref.current?.parentElement;
    if (parentElement)
      if (collapsed) {
        parentElement.style.height = '40px';
        parentElement.setAttribute('data-collapsed', 'true');
      } else {
        parentElement.style.height = 'auto';
        parentElement.removeAttribute('data-collapsed');
      }
  }, [collapsed, items]);
  return items.length ? (
    <div
      className={`${modDocumentOperations.documentOperations} ${
        collapsed ? modDocumentOperations.documentOperationsCollapsed : ''
      }`}
      ref={ref}
    >
      <Header
        toggleCollapsed={toggleCollapsed}
        collapsed={collapsed}
        text={text}
        additionalHeaderButtons={additionalHeaderButtons}
      />
      <ListBody items={items} />
    </div>
  ) : (
    <></>
  );
};

const _ = connector(CollapsableList);
export { _ as CollapsableList };

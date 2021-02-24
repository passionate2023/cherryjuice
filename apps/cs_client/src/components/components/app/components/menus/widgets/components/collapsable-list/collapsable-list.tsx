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
import { useCurrentBreakpoint } from '::hooks/current-breakpoint';

const mapState = (state: Store) => ({
  dialogIsOpen:
    state.dialogs.showDocumentList ||
    state.dialogs.showSettingsDialog ||
    state.dialogs.showDocumentMetaDialog ||
    state.search.searchState !== 'idle' ||
    state.dialogs.showNodeMetaDialog,
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
  const { mbOrTb } = useCurrentBreakpoint();
  const ref = useRef<HTMLDivElement>();
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => void setCollapsed(!collapsed);
  useEffect(() => {
    if (dialogIsOpen && mbOrTb) setCollapsed(true);
  }, [dialogIsOpen, mbOrTb]);

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
      className={`${modDocumentOperations.collapsableList} ${
        collapsed ? modDocumentOperations.collapsableListCollapsed : ''
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

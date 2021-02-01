import * as React from 'react';
import { useGroups } from './hooks/groups';
import { ac, Store } from '::store/store';
import { connect, ConnectedProps } from 'react-redux';
import { DropdownMenu } from '::shared-components/dropdown-menu/dropdown-menu';
import { testIds } from '::cypress/support/helpers/test-ids';

const mapState = (state: Store) => ({
  documentId: state.document.documentId,
  online: state.root.online,
  show: state.dialogs.showUserDropdownMenu,
  user: state.auth.user,
});
const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = Record<string, never>;
const UserDropdownMenu: React.FC<Props & PropsFromRedux> = ({
  online,
  documentId,
  show,
  user,
}) => {
  const elements = useGroups({ online, documentId, user });
  return (
    show && (
      <DropdownMenu
        groups={elements}
        hide={ac.dialogs.hideUserDropdownMenu}
        xOffset={5}
        assertions={[
          {
            selector: `[data-testid="${testIds.toolBar__navBar__userButton}"]`,
          },
        ]}
      />
    )
  );
};

const _ = connector(UserDropdownMenu);
export { _ as UserDropdownMenu };

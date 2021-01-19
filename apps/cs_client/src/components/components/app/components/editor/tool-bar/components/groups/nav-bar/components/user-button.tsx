import * as React from 'react';
import { ac, Store } from '::store/store';
import { testIds } from '::cypress/support/helpers/test-ids';
import { User } from '@cherryjuice/graphql-types';
import { modToolbar } from '::sass-modules';
import { GeneratedAvatar } from '::app/components/menus/modals/user/components/components/generated-avatar';
import { Icon, Icons } from '@cherryjuice/icons';
import { UserDropdownMenu } from '::app/components/menus/modals/user-dropdown-menu/user-dropdown-menu';
import { ToolbarButton, Tooltip } from '@cherryjuice/components';
import { connect, ConnectedProps } from 'react-redux';

const mapState = (state: Store) => ({
  user: state.auth.user,
  showUserDropdownMenu: state.dialogs.showUserDropdownMenu,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = Record<string, never>;

const UserButton: React.FC<Props & PropsFromRedux> = ({
  showUserDropdownMenu,
  user,
}) => {
  return (
    <ToolbarButton
      onClick={ac.dialogs.showUserDropdownMenu}
      active={showUserDropdownMenu}
      testId={testIds.toolBar__navBar__userButton}
    >
      <Tooltip label={'User preferences'} position={'bottom-left'}>
        {(user as User)?.picture ? (
          <img
            src={user.picture}
            alt="user profile picture"
            className={modToolbar.toolBar__groupNavBar__profilePicture}
          />
        ) : user?.id ? (
          <GeneratedAvatar
            firstName={user.firstName}
            lastName={user.lastName}
            id={user.id}
            size={18}
            textSizeToWidthRatio={0.4}
          />
        ) : (
          <Icon name={Icons.material['person-circle']} />
        )}
      </Tooltip>
      <UserDropdownMenu key={'UserDropdownMenu'} />
    </ToolbarButton>
  );
};

const _ = connector(UserButton);
export { _ as UserButton };

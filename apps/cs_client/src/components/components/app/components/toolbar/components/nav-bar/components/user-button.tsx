import * as React from 'react';
import { Store } from '::store/store';
import { testIds } from '::cypress/support/helpers/test-ids';
import { User } from '@cherryjuice/graphql-types';
import { GeneratedAvatar } from '::app/components/menus/modals/user/components/components/generated-avatar';
import { Icon, Icons } from '@cherryjuice/icons';
import { UserDropdownMenu } from '::app/components/menus/modals/user-dropdown-menu/user-dropdown-menu';
import { ToolbarButton } from '::app/components/toolbar/components/toolbar-button/toolbar-button';
import { connect, ConnectedProps } from 'react-redux';
import { Popper } from '@cherryjuice/components';

const mapState = (state: Store) => ({
  user: state.auth.user,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = Record<string, never>;

const UserButton: React.FC<Props & PropsFromRedux> = ({ user }) => {
  return (
    <Popper
      body={({ hide }) => (
        <UserDropdownMenu key={'UserDropdownMenu'} hide={hide} />
      )}
      getContext={{
        getIdOfActiveElement: () => 'UserDropdownMenu',
        getActiveElement: () =>
          document.querySelector(
            `[data-testid="${testIds.toolBar__navBar__userButton}"]`,
          ),
      }}
      positionPreferences={{
        positionX: 'rr',
        positionY: 'bt',
        offsetX: 3,
        offsetY: 3,
      }}
      style={{ paddingTop: 0, paddingBottom: 0 }}
    >
      {({ show }) => (
        <ToolbarButton
          onClick={show}
          testId={testIds.toolBar__navBar__userButton}
          tooltip={'User preferences'}
        >
          {(user as User)?.picture ? (
            <img
              src={user.picture}
              alt="user profile picture"
              style={{ width: 18, borderRadius: '50%', marginTop: -2 }}
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
        </ToolbarButton>
      )}
    </Popper>
  );
};

const _ = connector(UserButton);
export { _ as UserButton };

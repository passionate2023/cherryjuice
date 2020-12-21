import * as React from 'react';
import { memo } from 'react';
import { ToolbarButton } from '::root/components/app/components/editor/tool-bar/components/tool-bar-button/tool-bar-button';
import { Icon, Icons } from '@cherryjuice/icons';
import { modToolbar } from '::sass-modules';
import { ac, Store } from '::store/store';
import { testIds } from '::cypress/support/helpers/test-ids';
import { connect, ConnectedProps } from 'react-redux';
import { Search } from '::root/components/app/components/editor/tool-bar/components/groups/nav-bar/components/search/search';
import { User } from '@cherryjuice/graphql-types';
import { GeneratedAvatar } from '::root/components/app/components/menus/modals/user/components/components/generated-avatar';
import { hasWriteAccessToDocument } from '::store/selectors/document/has-write-access-to-document';
import { Tooltip } from '::root/components/shared-components/tooltip/tooltip';
import { DocumentDropdownMenu } from '::app/components/menus/modals/document-dropdown-menu/document-dropdown-menu';
import { UserDropdownMenu } from '::app/components/menus/modals/user-dropdown-menu/user-dropdown-menu';

const mapState = (state: Store) => ({
  user: state.auth.user,
  isDocumentOwner: hasWriteAccessToDocument(state),
  showDocumentDropdownMenu: state.dialogs.showDocumentDropdownMenu,
  showUserDropdownMenu: state.dialogs.showUserDropdownMenu,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {
  showUserPopup: boolean;
};

const NavBar: React.FC<Props & PropsFromRedux> = ({
  showUserDropdownMenu,
  showDocumentDropdownMenu,
  user,
  isDocumentOwner,
}) => {
  return (
    <div
      className={
        modToolbar.toolBar__group + ' ' + modToolbar.toolBar__groupNavBar
      }
    >
      <Search />

      <ToolbarButton
        dontMount={!isDocumentOwner}
        onClick={ac.dialogs.showDocumentDropdownMenu}
        active={showDocumentDropdownMenu}
      >
        <Tooltip label={'Document menu'}>
          <Icon name={Icons.material.add} />
        </Tooltip>
        <DocumentDropdownMenu key={'DocumentDropdownMenu'} />
      </ToolbarButton>
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
    </div>
  );
};
const _ = connector(NavBar);
const M = memo(_);
export { M as NavBar };

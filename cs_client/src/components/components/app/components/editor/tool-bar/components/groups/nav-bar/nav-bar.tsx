import * as React from 'react';
import { ToolbarButton } from '::root/components/app/components/editor/tool-bar/components/tool-bar-button/tool-bar-button';
import { Icon, Icons } from '::root/components/shared-components/icon/icon';
import { modToolbar } from '::sass-modules';
import { ac } from '::store/store';
import { testIds } from '::cypress/support/helpers/test-ids';

import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::store/store';
import { Search } from '::root/components/app/components/editor/tool-bar/components/groups/nav-bar/components/search/search';
import { User } from '::types/graphql/generated';
import { GeneratedAvatar } from '::root/components/app/components/menus/modals/user/components/components/generated-avatar';

const mapState = (state: Store) => ({
  documentId: state.document.documentId,
  user: state.auth.user,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {
  showUserPopup: boolean;
};

const NavBar: React.FC<Props & PropsFromRedux> = ({
  showUserPopup,
  documentId,
  user,
}) => {
  const isLoggedIn = user?.id;
  const noDocumentIsSelected = !documentId;
  return (
    <div
      className={
        modToolbar.toolBar__group + ' ' + modToolbar.toolBar__groupNavBar
      }
    >
      <Search />
      <ToolbarButton
        dontMount={!isLoggedIn}
        onClick={ac.dialogs.showCreateDocumentDialog}
        testId={'new-document'}
      >
        <Icon name={Icons.material.document} />
      </ToolbarButton>
      <ToolbarButton
        onClick={ac.document.export}
        disabled={noDocumentIsSelected}
        dontMount={!isLoggedIn}
      >
        <Icon
          name={Icons.material.export}
          testId={testIds.toolBar__navBar__exportDocument}
        />
      </ToolbarButton>
      <ToolbarButton
        onClick={ac.dialogs.showDocumentList}
        dontMount={!isLoggedIn}
      >
        <Icon
          name={Icons.material.folder}
          testId={testIds.toolBar__navBar__showDocumentList}
        />
      </ToolbarButton>
      <ToolbarButton
        onClick={ac.dialogs.toggleUserPopup}
        active={showUserPopup}
        testId={testIds.toolBar__navBar__userButton}
      >
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
      </ToolbarButton>
    </div>
  );
};
const _ = connector(NavBar);
export { _ as NavBar };

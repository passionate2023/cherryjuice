import * as React from 'react';
import { ToolbarButton } from '::root/components/app/components/editor/tool-bar/components/tool-bar-button/tool-bar-button';
import { Icon, Icons } from '::root/components/shared-components/icon/icon';
import { modToolbar } from '::sass-modules';
import { ac, Store } from '::store/store';
import { testIds } from '::cypress/support/helpers/test-ids';
import { connect, ConnectedProps } from 'react-redux';
import { Search } from '::root/components/app/components/editor/tool-bar/components/groups/nav-bar/components/search/search';
import { User } from '@cherryjuice/graphql-types';
import { GeneratedAvatar } from '::root/components/app/components/menus/modals/user/components/components/generated-avatar';
import { hasWriteAccessToDocument } from '::store/selectors/document/has-write-access-to-document';
import { Tooltip } from '::root/components/shared-components/tooltip/tooltip';

const mapState = (state: Store) => ({
  user: state.auth.user,
  noDocumentIsSelected: !state.document.documentId,
  isDocumentOwner: hasWriteAccessToDocument(state),
  showBookmarks: state.dialogs.showBookmarks,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {
  showUserPopup: boolean;
};

const NavBar: React.FC<Props & PropsFromRedux> = ({
  showUserPopup,
  user,
  showBookmarks,
  isDocumentOwner,
  noDocumentIsSelected,
}) => {
  const isLoggedIn = user?.id;
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
        <Tooltip label={'Create a new document'}>
          <Icon name={Icons.material.document} loadAsInlineSVG={'force'} />
        </Tooltip>
      </ToolbarButton>
      <ToolbarButton
        onClick={ac.dialogs.showDocumentList}
        dontMount={!isLoggedIn}
      >
        <Tooltip label={'Documents list'}>
          <Icon
            name={Icons.material.folder}
            testId={testIds.toolBar__navBar__showDocumentList}
            loadAsInlineSVG={'force'}
          />
        </Tooltip>
      </ToolbarButton>
      <ToolbarButton
        dontMount={!isDocumentOwner}
        disabled={noDocumentIsSelected}
        onClick={ac.dialogs.showBookmarksDialog}
        active={showBookmarks}
      >
        <Tooltip label={'Bookmarks'}>
          <Icon name={Icons.material.bookmarks} />
        </Tooltip>
      </ToolbarButton>
      <ToolbarButton
        onClick={ac.dialogs.toggleUserPopup}
        active={showUserPopup}
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
      </ToolbarButton>
    </div>
  );
};
const _ = connector(NavBar);
export { _ as NavBar };

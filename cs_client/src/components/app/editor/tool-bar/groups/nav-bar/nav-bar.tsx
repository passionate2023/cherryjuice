import * as React from 'react';
import { ToolbarButton } from '::app/editor/tool-bar/tool-bar-button';
import { Icon, Icons } from '::shared-components/icon/icon';
import { modToolbar } from '::sass-modules';
import { ac } from '::root/store/store';
import { testIds } from '::cypress/support/helpers/test-ids';

import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::root/store/store';
import { Search } from '::app/editor/tool-bar/groups/nav-bar/components/search/search';
import { User } from '::types/graphql/generated';

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
        onClick={ac.dialogs.showUserPopup}
        active={showUserPopup}
        testId={testIds.toolBar__navBar__userButton}
      >
        {(user as User)?.picture ? (
          <img
            src={user.picture}
            alt="user profile picture"
            className={modToolbar.toolBar__groupNavBar__profilePicture}
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

import * as React from 'react';
import { appActionCreators } from '::app/reducer';
import { ToolbarButton } from '::app/editor/tool-bar/tool-bar-button';
import { Icon, Icons } from '::shared-components/icon/icon';
import { modToolbar } from '::sass-modules/index';
import { useContext } from 'react';
import { RootContext } from '::root/root-context';
import { ac } from '::root/store/store';
import { testIds } from '::cypress/support/helpers/test-ids';

type Props = {
  showUserPopup: boolean;
};

const NavBar: React.FC<Props> = ({ showUserPopup }) => {
  const {
    session: {
      user: { picture: userPicture },
    },
  } = useContext(RootContext);
  return (
    <div
      className={
        modToolbar.toolBar__group + ' ' + modToolbar.toolBar__groupNavBar
      }
    >
      <ToolbarButton
        onClick={ac.dialogs.showCreateDocumentDialog}
        testId={'new-document'}
      >
        <Icon name={Icons.material.document} />
      </ToolbarButton>
      <ToolbarButton onClick={ac.document.export}>
        <Icon name={Icons.material.export} />
      </ToolbarButton>
      <ToolbarButton onClick={ac.dialogs.showDocumentList}>
        <Icon
          name={Icons.material.folder}
          testId={testIds.toolBar__navBar__showDocumentList}
        />
      </ToolbarButton>
      <ToolbarButton onClick={appActionCreators.toggleSettings}>
        <Icon name={Icons.material.settings} />
      </ToolbarButton>
      <ToolbarButton
        onClick={appActionCreators.toggleUserPopup}
        enabled={showUserPopup}
      >
        {userPicture ? (
          <img
            src={userPicture}
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

export { NavBar };

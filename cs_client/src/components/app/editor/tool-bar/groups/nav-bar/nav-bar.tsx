import * as React from 'react';
import { appActionCreators } from '::app/reducer';
import { ToolbarButton } from '::app/editor/tool-bar/tool-bar-button';
import { Icon, Icons } from '::shared-components/icon';
import { modToolbar } from '::sass-modules/index';
import { useContext } from 'react';
import { RootContext } from '::root/root-context';

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
      <ToolbarButton onClick={appActionCreators.toggleFileSelect}>
        <Icon name={Icons.material.folder} small={true} />
      </ToolbarButton>
      <ToolbarButton onClick={appActionCreators.toggleSettings}>
        <Icon name={Icons.material.settings} small={true} />
      </ToolbarButton>
      <ToolbarButton
        onClick={appActionCreators.toggleUserPopup}
        enabled={showUserPopup}
      >
        {userPicture ? (
          <img
            src={userPicture}
            alt="user profiel picture"
            className={modToolbar.toolBar__groupNavBar__profilePicture}
          />
        ) : (
          <Icon name={Icons.misc['person-circle']} />
        )}
      </ToolbarButton>
    </div>
  );
};

export { NavBar };

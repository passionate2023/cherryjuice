import * as React from 'react';
import { useCallback } from 'react';
import { modToolbar, modUserPopup } from '::sass-modules/index';
import { useClickOutsideModal } from '::hooks/use-click-outside-modal';
import { ButtonSquare } from '::shared-components/buttons/button-square/button-square';
import { animated } from 'react-spring';
import { ac } from '::root/store/store';
import { router } from '::root/router/router';
import { User as TUser } from '::types/graphql/generated';
import { UserInfo } from '::app/menus/user/components/user-info';
import { testIds } from '::cypress/support/helpers/test-ids';
type UserProps = {
  onClose: Function;
  user: TUser;
};

const User: React.FC<UserProps & { style }> = ({ onClose, style, user }) => {
  useClickOutsideModal({
    selectorsToIgnore: [
      '.' + modUserPopup.user__card,
      '.' + modToolbar.toolBar__groupNavBar,
    ],
    cb: onClose,
  });
  const signOut = useCallback(() => {
    ac.root.resetState();
    router.goto.signIn();
  }, []);
  const loggedIn = !!user;
  return (
    <animated.div className={modUserPopup.user__card} style={style}>
      {loggedIn && <UserInfo user={user} />}
      <div className={modUserPopup.user__actions}>
        {loggedIn ? (
          <>
            <ButtonSquare
              className={modUserPopup.user__actions__signOut}
              onClick={ac.dialogs.showSettingsDialog}
              dark={true}
              text={'settings'}
              testId={testIds.toolBar__userPopup__signOut}
            />
            <ButtonSquare
              className={modUserPopup.user__actions__signOut}
              onClick={signOut}
              dark={true}
              text={'sign out'}
              testId={testIds.toolBar__userPopup__signOut}
            />
          </>
        ) : (
          <>
            <ButtonSquare
              className={modUserPopup.user__actions__signOut}
              onClick={router.goto.signIn}
              dark={true}
              text={'sign in'}
              testId={testIds.toolBar__userPopup__signIn}
            />
          </>
        )}
      </div>
    </animated.div>
  );
};

export { User };
export { UserProps };

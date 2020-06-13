import * as React from 'react';
import { useCallback, useContext } from 'react';
import { modToolbar, modUserPopup } from '::sass-modules/index';
import { useClickOutsideModal } from '::hooks/use-click-outside-modal';
import { ButtonSquare } from '::shared-components/buttons/button-square/button-square';
import { TransitionWrapper } from '::shared-components/transition-wrapper';
import { animated } from 'react-spring';
import { RootContext } from '::root/root-context';
import { rootActionCreators } from '::root/root.reducer';
import { Icon, ICON_SIZE, Icons } from '::shared-components/icon';
import { router } from '::root/router/router';

type Props = {
  firstName: string;
  lastName: string;
  email: string;
  picture?: string;
  onClose: Function;
};

const User: React.FC<Props & { style }> = ({ onClose, style }) => {
  useClickOutsideModal({
    selectorsToIgnore: [
      '.' + modUserPopup.user__card,
      '.' + modToolbar.toolBar__groupNavBar,
    ],
    cb: onClose,
  });
  const { session } = useContext(RootContext);
  const signOut = useCallback(() => {
    rootActionCreators.setSession({ token: '', user: undefined });
    router.login();
  }, []);
  const { picture, email, firstName, lastName } = session.user;
  return (
    <animated.div className={modUserPopup.user__card} style={style}>
      <div className={modUserPopup.user__info}>
        {picture ? (
          <img
            src={picture}
            alt="profile-picture"
            className={modUserPopup.user__info__picture}
          />
        ) : (
          <Icon
            name={Icons.material['person-circle']}
            size={ICON_SIZE._145}
            className={modUserPopup.user__info__picture}
          />
        )}

        <span className={modUserPopup.user__info__name}>
          {firstName} {lastName}
        </span>
        <span className={modUserPopup.user__info__email}>{email}</span>
      </div>
      <div className={modUserPopup.user__actions}>
        <ButtonSquare
          className={modUserPopup.user__actions__signOut}
          onClick={signOut}
          dark={true}
        >
          sign out
        </ButtonSquare>
      </div>
    </animated.div>
  );
};

const UserWithTransition: React.FC<Props & { show: boolean }> = ({
  show,
  ...props
}) => {
  return (
    <TransitionWrapper<Props>
      Component={User}
      show={show}
      transitionValues={{
        from: {
          transformOrigin: 'top right',
          opacity: 0.5,
          transform: 'scale(0)',
        },
        enter: {
          opacity: 1,
          transform: 'scale(1)',
        },
        leave: { opacity: 0.5, transform: 'scale(0)' },
        config: {
          tension: 370,
        },
      }}
      componentProps={props}
    />
  );
};

export default UserWithTransition;

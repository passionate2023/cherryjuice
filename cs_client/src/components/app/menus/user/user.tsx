import person from '::assets/icons/material/large/person-circle.svg';
import * as React from 'react';
import { modToolbar, modUserPopup } from '::sass-modules/index';
import { useClickOutsideModal } from '::hooks/use-click-outside-modal';
import { ButtonSquare } from '::shared-components/buttons/buttonSquare';
import { TransitionWrapper } from '::shared-components/transition-wrapper';
import { animated } from 'react-spring';
import { useHistory } from 'react-router';
import { useCallback, useContext } from 'react';
import { RootContext } from '::root/root-context';
import { rootActionCreators } from '::root/root.reducer';
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
  const history = useHistory();
  const { session } = useContext(RootContext);
  const signOut = useCallback(() => {
    rootActionCreators.setSession({ token: '', user: undefined });
    history.push('/login');
  }, []);
  const { picture, email, firstName, lastName } = session.user;
  return (
    <animated.div className={modUserPopup.user__card} style={style}>
      <div className={modUserPopup.user__info}>
        <img
          src={picture || person}
          alt="profile-picture"
          className={modUserPopup.user__info__picture}
        />
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

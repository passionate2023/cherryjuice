import { ac, Store } from '::store/store';
import { connect, ConnectedProps } from 'react-redux';
import * as React from 'react';
import { TransitionWrapper } from '::root/components/shared-components/transitions/transition-wrapper';
import { User, UserProps } from './user';

const mapState = (state: Store) => ({
  show: state.dialogs.showUserPopup,
  user: state.auth.user,
});
const mapDispatch = { onClose: ac.dialogs.hideUserPopup };
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

const UserWithTransition: React.FC<UserProps & PropsFromRedux> = ({
  show,
  ...props
}) => {
  return (
    <TransitionWrapper<UserProps>
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

const _ = connector(UserWithTransition);
export default _;

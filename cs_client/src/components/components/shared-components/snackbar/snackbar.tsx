import * as React from 'react';
import { modSnackbar } from '::sass-modules';
import { Icon, Icons } from '::root/components/shared-components/icon/icon';
import { ButtonCircle } from '::root/components/shared-components/buttons/button-circle/button-circle';
import { ComponentWithTransition } from '::root/components/shared-components/transitions/component-with-transition';
import { transitions } from '::root/components/shared-components/transitions/transitions';
import { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::store/store';

const mapState = (state: Store) => ({
  message: state.dialogs.snackbar?.message,
});
const mapDispatch = {
  onClose: ac.dialogs.clearSnackbar,
};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {
  autoCloseDuration?: number;
};

const Snackbar: React.FC<Props & PropsFromRedux> = ({
  onClose,
  message,
  autoCloseDuration = 6000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, autoCloseDuration);
    return () => {
      clearInterval(timer);
    };
  }, [message]);
  return (
    <ComponentWithTransition
      onClose={onClose}
      useScrim={false}
      show={Boolean(message)}
      enableModalKeyboardEvents={false}
      transitionValues={transitions.t2}
      className={modSnackbar.snackbar__container}
    >
      <div className={modSnackbar.snackbar}>
        <span className={modSnackbar.snackbar__message}>{message}</span>
        <ButtonCircle
          key={Icons.material.delete}
          className={modSnackbar.snackbar__closeButton}
          onClick={onClose}
          icon={<Icon {...{ name: Icons.material.clear }} />}
        />
      </div>
    </ComponentWithTransition>
  );
};
const _ = connector(Snackbar);
export { _ as Snackbar };

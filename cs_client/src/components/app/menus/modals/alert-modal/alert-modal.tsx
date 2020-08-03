import * as React from 'react';
import { EventHandler } from 'react';
import { ConfirmationModal } from '::shared-components/modal/confirmation-modal';

import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::root/store/store';

const mapState = (state: Store) => ({
  alert: state.dialogs.alert,
  show: Boolean(state.dialogs.alert),
  onClose: ac.dialogs.clearAlert,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

export type Props = {
  onClose: EventHandler<undefined>;
};

const AlertModal: React.FC<Props & PropsFromRedux> = ({
  onClose,
  show,
  alert,
}) => {
  const buttons = [];
  if (alert?.action) {
    buttons.push({
      label: alert.action.name,
      // @ts-ignore
      onClick: () => {
        alert.action.callbacks.forEach(ac => {
          ac();
        });
      },
      disabled: false,
    });
  }

  buttons.push({
    label: alert?.dismissAction ? alert?.dismissAction.name : 'Dismiss',
    onClick: alert?.dismissAction
      ? () => {
          onClose();
          alert.dismissAction.callbacks.forEach(action => action());
        }
      : onClose,
    disabled: false,
    lazyAutoFocus: 300,
  });
  return (
    <ConfirmationModal
      show={show}
      onClose={onClose}
      alert={alert}
      buttons={buttons}
    />
  );
};

const _ = connector(AlertModal);
export default _;

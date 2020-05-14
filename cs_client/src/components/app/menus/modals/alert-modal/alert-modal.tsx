import * as React from 'react';
import { EventHandler } from 'react';
import { TAlert } from '::types/react';
import { ConfirmationModal } from '::shared-components/modal/confirmation-modal';

export type Props = {
  onClose: EventHandler<undefined>;
  alert: TAlert;
};

const AlertModal: React.FC<Props & { show: boolean }> = ({
  onClose,
  show,
  alert,
}) => {
  const buttons = [
    {
      label: 'Dismiss',
      onClick: onClose,
      disabled: false,
      lazyAutoFocus: 300,
    },
  ];
  return (
    <ConfirmationModal
      show={show}
      onClose={onClose}
      alert={alert}
      buttons={buttons}
    />
  );
};

export default AlertModal;

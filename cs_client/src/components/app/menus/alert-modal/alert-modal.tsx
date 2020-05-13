import { modAlertModal } from '::sass-modules/index';
import * as React from 'react';
import { EventHandler } from 'react';
import { ButtonSquare } from '::shared-components/buttons/buttonSquare';
import { AlertType, TAlert } from '::types/react';
import { usePrevPropIfNewPropIsUndefined } from '::hooks/use-prev-prop-if-new-prop-is-undefined';
import { ModalWithTransition } from '::shared-components/modal/modal';

export type Props = {
  onClose: EventHandler<undefined>;
  alert: TAlert;
};

const headerVariant = {
  [AlertType.Error]: modAlertModal.alertModal__headerDanger,
  [AlertType.Warning]: modAlertModal.alertModal__headerWarning,
};

const Alert = ({ alert, onClose }: Props) => {
  alert = usePrevPropIfNewPropIsUndefined(alert);

  return (
    <>
      <span className={modAlertModal.alertModal__body}>
        <span
          className={`${modAlertModal.alertModal__header} ${headerVariant[
            alert?.type
          ] || ''}`}
        >
          {alert?.title}
        </span>
        <span className={`${modAlertModal.alertModal__message}`}>
          {alert?.description}
        </span>
      </span>
      <ButtonSquare
        className={`${modAlertModal.alertModal__dismissButton}`}
        onClick={onClose}
        lazyAutoFocus={300}
      >
        Dismiss
      </ButtonSquare>
    </>
  );
};

const AlertModal: React.FC<Props & { show: boolean }> = ({
  onClose,
  show,
  alert,
}) => {
  return (
    <ModalWithTransition show={show} onClose={onClose}>
      <Alert onClose={onClose} alert={alert} />
    </ModalWithTransition>
  );
};

export default AlertModal;

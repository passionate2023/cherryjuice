import { modAlertModal } from '::sass-modules/index';
import * as React from 'react';
import { EventHandler } from 'react';
import { ButtonSquare } from '::shared-components/buttons/buttonSquare';
import { Icon, ICON_SIZE, Icons } from '::shared-components/icon';
import { TAlert } from '::types/react';
import { usePrevPropIfNewPropIsUndefined } from '::hooks/use-prev-prop-if-new-prop-is-undefined';
import { ModalWithTransition } from '::shared-components/modal/modal';

export type Props = {
  onClose: EventHandler<undefined>;
  alert: TAlert;
};

const Alert = ({ alert, onClose }) => {
  alert = usePrevPropIfNewPropIsUndefined(alert);
  return (
    <>
      <Icon
        name={Icons.material[alert.type]}
        className={`${modAlertModal.alertModal__icon}`}
        size={ICON_SIZE._48}
      />
      <span className={modAlertModal.alertModal__body}>
        <span className={`${modAlertModal.alertModal__header}`}>
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

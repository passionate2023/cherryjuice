import { modAlertModal, modDeleteNode } from '::sass-modules/index';
import { EventHandler, default as React } from 'react';
import { TDialogFooterButton } from '::shared-components/dialog/dialog-footer';
import { ButtonSquare } from '::shared-components/buttons/buttonSquare';
import { AlertType, TAlert } from '::types/react';
import { ComponentWithTransition } from '::shared-components/transitions/component-with-transition';
import { transitions } from '::shared-components/transitions/transitions';

const headerVariant = {
  [AlertType.Error]: modAlertModal.alertModal__headerDanger,
  [AlertType.Warning]: modAlertModal.alertModal__headerWarning,
};

const ModalBody = ({ title, description, type }: TAlert) => {
  return (
    <>
      <span className={modAlertModal.alertModal__body}>
        <span
          className={`${modAlertModal.alertModal__header} ${headerVariant[type]}`}
        >
          {title}
        </span>
        <span className={`${modAlertModal.alertModal__message}`}>
          {description}
        </span>
      </span>
    </>
  );
};

type ConfirmationModalProps = {
  alert: TAlert;
  show: boolean;
  onClose: EventHandler<undefined>;
  buttons: TDialogFooterButton[];
};
const ConfirmationModal = ({
  show,
  onClose,
  alert,
  buttons,
}: ConfirmationModalProps) => (
  <ComponentWithTransition
    show={show}
    onClose={onClose}
    transitionValues={transitions.t1}
    className={modAlertModal.alertModal}
  >
    <ModalBody {...alert} />
    <div className={modDeleteNode.deleteDocument__buttons}>
      {buttons.map(({ onClick, label, disabled }, i) => (
        <ButtonSquare
          key={i}
          className={`${modAlertModal.alertModal__dismissButton}`}
          onClick={onClick}
          lazyAutoFocus={i === 0 && 300}
          disabled={disabled}
        >
          {label}
        </ButtonSquare>
      ))}
    </div>
  </ComponentWithTransition>
);

export { ConfirmationModal };

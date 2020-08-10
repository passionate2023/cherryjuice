import { modAlertModal, modDeleteNode } from '::sass-modules';
import { EventHandler, default as React } from 'react';
import { TDialogFooterButton } from '::root/components/shared-components/dialog/dialog-footer';
import { ButtonSquare } from '::root/components/shared-components/buttons/button-square/button-square';
import { ComponentWithTransition } from '::root/components/shared-components/transitions/component-with-transition';
import { transitions } from '::root/components/shared-components/transitions/transitions';
import { AlertType } from '::types/react';
import { joinClassNames } from '::helpers/dom/join-class-names';

const headerVariant = {
  [AlertType.Error]: modAlertModal.alertModal__headerDanger,
  [AlertType.Warning]: modAlertModal.alertModal__headerWarning,
};

type BaseModalProps = {
  show: boolean;
  onClose: EventHandler<undefined>;
  buttons: TDialogFooterButton[];
  title: string;
  alertType?: AlertType;
};
const BaseModal: React.FC<BaseModalProps> = ({
  show,
  onClose,
  buttons,
  children,
  title,
  alertType,
}) => (
  <ComponentWithTransition
    show={show}
    onClose={onClose}
    transitionValues={transitions.t1}
    className={modAlertModal.alertModal}
  >
    <span className={modAlertModal.alertModal__body}>
      <span
        className={joinClassNames([
          modAlertModal.alertModal__header,
          [headerVariant[alertType], Boolean(alertType)],
        ])}
      >
        {title}
      </span>
      {children}
    </span>
    <div className={modDeleteNode.deleteDocument__buttons}>
      {buttons.map(({ onClick, label, disabled, testId, lazyAutoFocus }, i) => (
        <ButtonSquare
          key={i}
          className={`${modAlertModal.alertModal__dismissButton}`}
          onClick={onClick}
          lazyAutoFocus={lazyAutoFocus}
          disabled={disabled}
          testId={testId}
          text={label}
        />
      ))}
    </div>
  </ComponentWithTransition>
);

export { BaseModal };
export { BaseModalProps };

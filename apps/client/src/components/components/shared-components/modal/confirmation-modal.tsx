import { modAlertModal } from '::sass-modules';
import { default as React } from 'react';
import { TAlert } from '::types/react';
import {
  BaseModal,
  BaseModalProps,
} from '::root/components/shared-components/modal/base-modal';

const ModalBody = ({ description }: TAlert) => {
  return (
    <>
      <span className={`${modAlertModal.alertModal__message}`}>
        {description}
      </span>
    </>
  );
};

type ConfirmationModalProps = Omit<BaseModalProps, 'title'> & {
  alert: TAlert;
};
const ConfirmationModal = ({
  show,
  onClose,
  alert,
  buttons,
}: ConfirmationModalProps) => (
  <BaseModal
    show={show}
    onClose={onClose}
    buttons={buttons}
    title={alert?.title}
    alertType={alert?.type}
  >
    <ModalBody {...alert} />
  </BaseModal>
);

export { ConfirmationModal };

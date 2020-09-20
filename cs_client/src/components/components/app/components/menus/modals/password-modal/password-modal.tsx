import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::store/store';
import {
  BaseModal,
  BaseModalProps,
} from '::root/components/shared-components/modal/base-modal';
import {
  ValidatedTextInput,
  ValidatedTextInputProps,
} from '::root/components/shared-components/form/validated-text-input';
import { AlertType } from '::types/react';
import { createRef, useState } from 'react';
import { patterns } from '::root/components/auth/helpers/form-validation';

const mapState = (state: Store) => ({
  show: Boolean(state.dialogs.showPasswordModal),
});
const mapDispatch = {
  onClose: ac.dialogs.hidePasswordModal,
};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type ModalProps = Omit<BaseModalProps, 'buttons'> & {};
const PasswordModal: React.FC<ModalProps & PropsFromRedux> = ({
  show,
  onClose,
}: ModalProps) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [valid, setValid] = useState(false);
  const inputProps: ValidatedTextInputProps = {
    inputRef: createRef(),
    variableName: 'currentPassword',
    patterns: [patterns.password],
    label: 'current password',
    type: 'password',
    minLength: 8,
    required: true,
    idPrefix: 'password-modal',
    value: currentPassword,
    onChange: setCurrentPassword,
    setValid,
  };

  const buttons = [];
  buttons.push({
    label: 'Confirm',
    onClick() {
      ac.dialogs.confirmPasswordModal(currentPassword);
      setCurrentPassword('');
    },
    disabled: !currentPassword || !valid,
    lazyAutoFocus: true,
  });
  buttons.push({
    label: 'Dismiss',
    onClick: onClose,
    disabled: false,
  });

  return (
    <BaseModal
      show={show}
      onClose={onClose}
      buttons={buttons}
      title={'Enter your current password'}
      alertType={AlertType.Neutral}
    >
      <ValidatedTextInput {...inputProps} />
    </BaseModal>
  );
};
const _ = connector(PasswordModal);
export default _;

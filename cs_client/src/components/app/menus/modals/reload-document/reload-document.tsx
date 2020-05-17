import * as React from 'react';
import { EventHandler } from 'react';
import { TDialogFooterButton } from '::shared-components/dialog/dialog-footer';
import { ConfirmationModal } from '::shared-components/modal/confirmation-modal';
import { AlertType } from '::types/react';
import { appActionCreators } from '::app/reducer';

export type Props = {
  show: boolean;
  onClose: EventHandler<undefined>;
};

const ReloadDocument: React.FC<Props> = ({ onClose, show }) => {
  const buttons: TDialogFooterButton[] = [
    {
      label: 'Dismiss',
      onClick: appActionCreators.hideReloadConfirmationModal,
      disabled: false,
    },
    {
      label: 'Reload',
      onClick: appActionCreators.reloadDocument,
      disabled: false,
    },
  ];
  return (
    <ConfirmationModal
      show={show}
      onClose={onClose}
      alert={{
        type: AlertType.Warning,
        description: ' unsaved changes will be lost',
        title: 'Reload document?',
      }}
      buttons={buttons}
    />
  );
};

export default ReloadDocument;

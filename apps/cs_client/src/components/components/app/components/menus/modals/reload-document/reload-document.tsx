import * as React from 'react';
import { TDialogFooterButton } from '::root/components/shared-components/dialog/dialog-footer';
import { ConfirmationModal } from '::root/components/shared-components/modal/confirmation-modal';
import { AlertType } from '::types/react';
import { connect, ConnectedProps } from 'react-redux';
import { ac } from '::store/store';
import { Store } from '::store/store';

const mapState = (state: Store) => ({
  show: state.dialogs.showReloadDocument,
});

const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};

const ReloadDocument: React.FC<Props & PropsFromRedux> = ({ show }) => {
  const buttons: TDialogFooterButton[] = [
    {
      label: 'Dismiss',
      onClick: ac.dialogs.hideReloadDocument,
      disabled: false,
      lazyAutoFocus: true,
    },
    {
      label: 'Reload',
      onClick: ac.document.fetch,
      disabled: false,
    },
  ];
  return (
    <ConfirmationModal
      show={show}
      onClose={ac.dialogs.hideReloadDocument}
      alert={{
        type: AlertType.Warning,
        description: ' unsaved changes will be lost',
        title: 'Reload document?',
      }}
      buttons={buttons}
    />
  );
};

export default connector(ReloadDocument);

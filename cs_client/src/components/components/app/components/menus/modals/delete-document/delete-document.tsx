import * as React from 'react';
import { TDialogFooterButton } from '::root/components/shared-components/dialog/dialog-footer';
import { ConfirmationModal } from '::root/components/shared-components/modal/confirmation-modal';
import { AlertType, TAlert } from '::types/react';
import { connect, ConnectedProps } from 'react-redux';
import { ac,} from '::store/store';
import { Store } from '::store/store';
import { testIds } from '::cypress/support/helpers/test-ids';

const createAlert = (selectedDocumentIds: string[]): TAlert => {

  const title = selectedDocumentIds.length
    ? `delete ${
        selectedDocumentIds.length === 1
          ? `document '${selectedDocumentIds[0]}'`
          : `the ${selectedDocumentIds.length} selected documents`
      } ?`
    : '';
  const description = "you can't undo this action";
  return {
    type: AlertType.Warning,
    description,
    title,
  };
};

const mapState = (state: Store) => ({
  show: state.dialogs.showDeleteDocument,
  selectedDocumentIds: state.documentsList.selectedIDs,
});

const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};

const DeleteDocument: React.FC<Props & PropsFromRedux> = ({
  show,
  selectedDocumentIds,
}) => {
  const buttons: TDialogFooterButton[] = [
    {
      label: 'Dismiss',
      onClick: ac.dialogs.hideDeleteDocument,
      disabled: false,
      lazyAutoFocus: 300,
    },
    {
      label: 'Delete',
      onClick:
        selectedDocumentIds.length === 1
          ? () => ac.documentsList.deleteDocument(selectedDocumentIds[0])
          : ac.documentsList.deleteDocuments,
      disabled: false,
      testId: testIds.modal__deleteDocument__confirm,
    },
  ];

  return (
    <ConfirmationModal
      show={show && !!selectedDocumentIds.length}
      onClose={ac.dialogs.hideDeleteDocument}
      alert={createAlert(selectedDocumentIds)}
      buttons={buttons}
    />
  );
};

export default connector(DeleteDocument);

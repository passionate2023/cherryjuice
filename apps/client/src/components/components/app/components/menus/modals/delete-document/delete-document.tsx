import * as React from 'react';
import { TDialogFooterButton } from '::root/components/shared-components/dialog/dialog-footer';
import { ConfirmationModal } from '::root/components/shared-components/modal/confirmation-modal';
import { AlertType, TAlert } from '::types/react';
import { connect, ConnectedProps } from 'react-redux';
import { ac } from '::store/store';
import { Store } from '::store/store';
import { testIds } from '@cherryjuice/test-ids';

const createAlert = (
  selectedDocumentIds: string[],
  documentIdNameDict: Record<string, string>,
): TAlert => {
  const selectedDocumentId = selectedDocumentIds[0];
  const title = selectedDocumentIds.length
    ? `delete ${
        selectedDocumentIds.length === 1
          ? `'${documentIdNameDict[selectedDocumentId]}'`
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
  documentIdNameDict: Object.fromEntries(
    Object.values(state.documentCache.documents).map(({ id, name }) => [
      id,
      name,
    ]),
  ),
});

const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};

const DeleteDocument: React.FC<Props & PropsFromRedux> = ({
  show,
  selectedDocumentIds,
  documentIdNameDict,
}) => {
  const buttons: TDialogFooterButton[] = [
    {
      label: 'Dismiss',
      onClick: ac.dialogs.hideDeleteDocument,
      disabled: false,
      lazyAutoFocus: true,
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
      alert={createAlert(selectedDocumentIds, documentIdNameDict)}
      buttons={buttons}
    />
  );
};

export default connector(DeleteDocument);

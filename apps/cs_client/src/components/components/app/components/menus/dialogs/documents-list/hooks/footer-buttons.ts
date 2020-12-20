import { ac } from '::store/store';
import { testIds } from '::cypress/support/helpers/test-ids';
import { TDialogFooterButton } from '::shared-components/dialog/dialog-footer';
import { useMemo } from 'react';

export const useFooterButtons = ({
  numberOfDocuments,
  selectedID,
  documentId,
  close,
  open,
  deleteMode,
  online,
}): [TDialogFooterButton[], TDialogFooterButton[]] => {
  return useMemo(() => {
    return [
      [
        {
          label: 'reload',
          onClick: ac.documentsList.fetchDocuments,
          disabled: !online,
        },
        {
          label: 'import',
          onClick: ac.dialogs.showImportDocument,
          disabled: !online,
          testId: testIds.dialogs__selectDocument__footerLeft__import,
        },
      ],
      [
        {
          label: 'close',
          onClick: close,
          disabled: false,
          testId: 'close-document-select',
        },
        {
          testId: testIds.dialogs__selectDocument__footerRight__open,
          label: 'open',
          onClick: open,
          disabled:
            deleteMode || selectedID === documentId || numberOfDocuments !== 1,
        },
      ],
    ];
  }, [online, open, deleteMode, documentId, selectedID, numberOfDocuments]);
};

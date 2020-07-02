import * as React from 'react';
import { modSelectFile } from '::sass-modules/index';
import { PopupItem } from './components/popup-item';
import { ac } from '::root/store/store';
import { useDeleteFile } from '::app/menus/select-file/hooks/delete-documents/delete-file';

type Props = {
  documentId: string;
};

const ThreeDotsPopup: React.FC<Props> = ({ documentId }) => {
  const { deleteDocument } = useDeleteFile({
    IDs: [documentId],
    onCompleted: () => {
      ac.documentsList.fetchDocuments();
      ac.document.setDocumentId(undefined);
    },
  });
  return (
    <div className={modSelectFile.selectFile__file__threeDotsPopup}>
      {[
        {
          itemName: 'edit',
          onClick: () => ac.dialogs.showEditDocumentDialog(documentId),
        },
        {
          itemName: 'delete',
          onClick: deleteDocument,
        },
      ].map(attributes => (
        <PopupItem key={attributes.itemName} {...attributes} />
      ))}
    </div>
  );
};

export { ThreeDotsPopup };

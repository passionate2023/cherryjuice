import * as React from 'react';
import { modSelectFile } from '::sass-modules';
import { PopupItem } from './components/popup-item';
import { ac } from '::store/store';

type Props = {
  documentId: string;
};

const ThreeDotsPopup: React.FC<Props> = ({ documentId }) => {
  return (
    <div className={modSelectFile.selectFile__file__threeDotsPopup}>
      {[
        {
          itemName: 'edit',
          onClick: () => ac.dialogs.showEditDocumentDialog(documentId),
        },
        {
          itemName: 'delete',
          onClick: () => ac.documentsList.deleteDocument(documentId),
        },
      ].map(attributes => (
        <PopupItem key={attributes.itemName} {...attributes} />
      ))}
    </div>
  );
};

export { ThreeDotsPopup };
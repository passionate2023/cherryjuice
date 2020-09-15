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
          itemName: 'cache',
          onClick: () => ac.node.fetchAll(documentId),
        },
        {
          itemName: 'delete',
          onClick: () => ac.dialogs.showDeleteDocument(),
        },
      ].map(attributes => (
        <PopupItem key={attributes.itemName} {...attributes} />
      ))}
    </div>
  );
};

export { ThreeDotsPopup };

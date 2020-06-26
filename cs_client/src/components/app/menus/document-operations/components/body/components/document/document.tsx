import * as React from 'react';
import { modDocumentOperations } from '::sass-modules/index';
import { DocumentSubscription } from '::types/graphql/generated';
import { ac } from '::root/store/store';
import { useDeleteFile } from '::app/menus/select-file/hooks/delete-documents/delete-file';
import { mapEventType } from './helpers/map-event-type';
import { ActionButton } from './components/action-button';
import { useContext } from 'react';
import { RootContext } from '::root/root-context';

const Document: React.FC<DocumentSubscription> = document => {
  const { name, status, id } = document;
  const { deleteDocument } = useDeleteFile({ IDs: [id] });
  const open = () => {
    ac.document.setDocumentId(id);
  };
  const {
    session: {
      user: { id: userId },
    },
  } = useContext(RootContext);
  return (
    <div className={modDocumentOperations.documentOperations__document}>
      <div className={modDocumentOperations.documentOperations__document__name}>
        {name}
      </div>
      <div
        className={modDocumentOperations.documentOperations__document__status}
      >
        {mapEventType(status)}
      </div>
      <ActionButton {...{ open, deleteDocument, document, userId }} />
    </div>
  );
};

export { Document };

import { ac } from '::store/store';

const deleteDocument = ({ documentId }: { documentId: string }) => {
  ac.documentCache.deleteDocument(documentId);
};

const deleteLocalDocuments = ({ IDs }: { IDs: string[] }) => {
  IDs.forEach(documentId => {
    deleteDocument({ documentId });
  });
};

export { deleteLocalDocuments };

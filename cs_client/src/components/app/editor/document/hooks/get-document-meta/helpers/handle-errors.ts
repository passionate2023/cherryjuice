import { ac } from '::root/store/actions.types';

const handleErrors = ({ file_id, documentId, error }) => {
  if (error) {
    if (file_id && file_id === documentId) {
      ac.document.setDocumentId(undefined);
    } else {
      ac.document.setDocumentId(documentId);
    }
  } else {
    if (documentId && !file_id) ac.document.setDocumentId(documentId);
    else if (file_id !== documentId && !/(login.*|signup.*)/.test(file_id)) {
      ac.document.setDocumentId(file_id);
    }
  }
};

export { handleErrors };

import { ac } from '::root/store/store';

const handleErrors = ({ file_id, documentId, error }) => {
  if (error) {
    if (file_id && file_id === documentId) {
      return ac.document.fetchFailed();
    } else {
      return ac.document.setDocumentId(documentId);
    }
  } else {
    if (documentId && !file_id) return ac.document.setDocumentId(documentId);
    else if (file_id !== documentId && !/(login.*|signup.*)/.test(file_id)) {
      return ac.document.setDocumentId(file_id);
    }
  }
};

export { handleErrors };

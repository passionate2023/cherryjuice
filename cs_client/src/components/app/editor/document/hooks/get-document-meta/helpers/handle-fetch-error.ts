import { ac } from '::root/store/store';

const handleFetchError = ({ file_id, documentId }) => error => {
  if (error) {
    if (file_id && file_id === documentId) {
      return ac.__.document.fetchFailed();
    } else {
      return ac.__.document.setDocumentId(documentId);
    }
  } else {
    if (documentId && !file_id) return ac.__.document.setDocumentId(documentId);
    else if (file_id !== documentId && !/(login.*|signup.*)/.test(file_id)) {
      return ac.__.document.setDocumentId(file_id);
    }
  }
};

export { handleFetchError };

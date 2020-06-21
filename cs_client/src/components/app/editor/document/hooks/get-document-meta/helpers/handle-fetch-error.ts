import { ac } from '::root/store/store';

const handleFetchError = ({
  previousDocumentId,
  documentIdBeingFetched,
}) => () => {
  if (documentIdBeingFetched.startsWith('new-document'))
    return ac.__.document.fetchFailed();
  if (documentIdBeingFetched && documentIdBeingFetched === previousDocumentId) {
    return ac.__.document.fetchFailed();
  }
  return ac.__.document.setDocumentId(previousDocumentId);
};

export { handleFetchError };

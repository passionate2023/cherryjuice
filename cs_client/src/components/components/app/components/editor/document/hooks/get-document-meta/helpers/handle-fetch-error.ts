import { ac_ } from '::store/store';
import { router } from '::root/router/router';

const handleFetchError = ({
  previousDocumentId,
  documentIdBeingFetched,
  userId,
}) => () => {
  if (!userId) {
    router.goto.signIn();
    return ac_.root.resetState();
  }
  if (documentIdBeingFetched.startsWith('new-document'))
    return ac_.document.fetchFailed();
  if (documentIdBeingFetched && documentIdBeingFetched === previousDocumentId) {
    return ac_.document.fetchFailed();
  }
  return ac_.document.setDocumentId(previousDocumentId);
};

export { handleFetchError };

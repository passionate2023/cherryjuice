import { ac } from '::store/store';
import { router } from '::root/router/router';

const handleFetchError = ({
  previousDocumentId,
  documentIdBeingFetched,
  userId,
}) => () => {
  if (!userId) {
    router.goto.signIn();
    return ac.__.root.resetState();
  }
  if (documentIdBeingFetched.startsWith('new-document'))
    return ac.__.document.fetchFailed();
  if (documentIdBeingFetched && documentIdBeingFetched === previousDocumentId) {
    return ac.__.document.fetchFailed();
  }
  return ac.__.document.setDocumentId(previousDocumentId);
};

export { handleFetchError };

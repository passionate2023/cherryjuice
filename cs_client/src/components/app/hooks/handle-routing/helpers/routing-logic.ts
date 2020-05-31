import { navigate } from '::root/router/navigate';

const routingLogic = ({ documentId, pathname = '/', isFirstCall = false }) => {
  const docIdInPath = [/\/*document\/([^/]*)/.exec(pathname)]
    .filter(Boolean)
    .map(res => res[1])[0];
  const newDocumentIsEmpty = !documentId;
  const newDocument = Boolean(documentId) && documentId !== docIdInPath;
  if (newDocumentIsEmpty) {
    if (!isFirstCall) {
      navigate.home();
    }
  } else if (newDocument) {
    navigate.document(documentId);
  }
};

export { routingLogic };

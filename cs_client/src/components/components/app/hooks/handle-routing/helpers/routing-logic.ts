import { router } from '::root/router/router';

const routingLogic = ({ documentId, pathname = '/', isFirstCall = false }) => {
  const docIdInPath = [/\/*document\/([^/]*)/.exec(pathname)]
    .filter(Boolean)
    .map(res => res[1])[0];
  const noSelectedDocument = !documentId;
  const newDocument = Boolean(documentId) && documentId !== docIdInPath;
  if (noSelectedDocument) {
    if (!isFirstCall) {
      router.goto.home();
    }
  } else if (newDocument) {
    router.goto.document(documentId);
  }
};

export { routingLogic };

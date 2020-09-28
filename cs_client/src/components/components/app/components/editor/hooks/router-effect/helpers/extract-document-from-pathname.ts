export type DocumentInPath = {
  documentId: string;
  node_id: number;
  hash?: string;
};
export const extractDocumentFromPathname = (
  pathname = location.pathname,
): DocumentInPath => {
  const params = /\/document\/([^/]*)\/node\/([\d]*)/.exec(pathname);
  if (params) {
    const documentId = params && params[1];
    const node_id = params && +params[2];
    return {
      documentId,
      node_id,
      hash: location.hash ? location.hash.substring(1) : undefined,
    };
  } else {
    const params = /\/document\/([^/]*)/.exec(pathname);
    const documentId = params && params[1];
    return { documentId, node_id: 0 };
  }
};

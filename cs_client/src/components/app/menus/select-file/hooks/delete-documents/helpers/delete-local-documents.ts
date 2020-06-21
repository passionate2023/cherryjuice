import { apolloCache } from '::graphql/cache/apollo-cache';

const deleteImages = ({ documentId }: { documentId: string }) => {
  if (apolloCache.changes.document().unsaved.includes(documentId)) {
    apolloCache.changes
      .document(documentId)
      .image.created.forEach(([nodeId, imageIds]) => {
        imageIds.forEach(apolloCache.image.delete.hard({ documentId, nodeId }));
      });
  }
};

const deleteNodes = ({ documentId }: { documentId: string }) => {
  if (apolloCache.changes.document().unsaved.includes(documentId)) {
    const nodes = apolloCache.changes.document(documentId).node.created;
    nodes.forEach(nodeId => {
      apolloCache.node.delete.hard({ documentId, nodeId });
    });
  }
};

const deleteDocument = ({ documentId }: { documentId: string }) => {
  apolloCache.document.delete.hard(documentId);
  apolloCache.changes.resetDocumentChangesState(documentId);
};

const deleteLocalDocuments = ({ IDs }: { IDs: string[] }) => {
  IDs.forEach(documentId => {
    deleteNodes({ documentId });
    deleteImages({ documentId });
    deleteDocument({ documentId });
  });
};

export { deleteLocalDocuments };

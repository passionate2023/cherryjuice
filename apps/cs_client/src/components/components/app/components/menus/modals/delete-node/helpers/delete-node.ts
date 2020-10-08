import { ac } from '::store/store';
import { QFullNode } from '::store/ducks/document-cache/document-cache';

const deleteNode = (deletedNode: QFullNode) => {
  return () => {
    ac.documentCache.deleteNode({
      documentId: deletedNode.documentId,
      node_id: deletedNode.node_id,
      mode: 'soft',
    });
    ac.timelines.showUndoDocumentAction();
  };
};

export { deleteNode };

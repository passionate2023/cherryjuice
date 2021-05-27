import { ac } from '::store/store';
import { NodeMeta } from '::app/components/menus/dialogs/node-meta/reducer/reducer';
import { getNode } from '::store/selectors/cache/document/node';
import { generateNode } from '::app/components/menus/dialogs/node-meta/hooks/save/helpers/create-node/helpers/generate-node';
import { CachedDocument } from '::store/ducks/document-cache/document-cache';

export const createNode = ({
  document,
  createSibling,
  nodeBMeta,
}: {
  document: CachedDocument;
  createSibling: boolean;
  nodeBMeta: NodeMeta;
}) => {
  const documentId = document.id;
  const focusedNode = getNode({
    node_id: document.persistedState.selectedNode_id,
    documentId,
  });

  const selectedNodeIsASibling = createSibling && focusedNode.father_id !== -1;
  const previous_sibling_node_id = selectedNodeIsASibling
    ? focusedNode.node_id
    : -1;

  const createdNode = generateNode({
    documentId,
    highestNode_id: document?.localState?.highestNode_id,
    fatherId: selectedNodeIsASibling ? focusedNode.fatherId : focusedNode.id,
    father_id: selectedNodeIsASibling
      ? focusedNode.father_id
      : focusedNode.node_id,
    nodeBMeta,
  });
  ac.documentCache.createNode({
    createdNode: createdNode,
    previous_sibling_node_id,
  });

  return { node_id: createdNode.node_id, documentId: createdNode.documentId };
};

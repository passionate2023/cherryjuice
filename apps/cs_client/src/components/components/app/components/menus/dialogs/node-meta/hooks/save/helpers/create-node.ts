import { updateCachedHtmlAndImages } from '::root/components/editor/components/content-editable/helpers/apollo-cache';
import { ac } from '::store/store';
import { NodeMeta } from '::root/components/app/components/menus/dialogs/node-meta/reducer/reducer';
import { getNode } from '::store/selectors/cache/document/node';
import { generateNode } from '::root/components/app/components/menus/dialogs/node-meta/hooks/save/helpers/generate-node';
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

  updateCachedHtmlAndImages();
  ac.documentCache.createNode({
    createdNode: generateNode({
      documentId,
      highestNode_id: document?.localState?.highestNode_id,
      fatherId: selectedNodeIsASibling ? focusedNode.fatherId : focusedNode.id,
      father_id: selectedNodeIsASibling
        ? focusedNode.father_id
        : focusedNode.node_id,
      nodeBMeta,
    }),
    previous_sibling_node_id,
  });
};

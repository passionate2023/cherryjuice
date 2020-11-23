import {
  DocumentCacheState,
  QFullNode,
} from '::store/ducks/document-cache/document-cache';
import {
  newImagePrefix,
  newNodePrefix,
} from '::root/components/app/components/editor/document/components/rich-text/hooks/add-meta-to-pasted-images';
import { createNode } from '::store/ducks/document-cache/helpers/node/create-node';
import { mutateNodeContent } from '::store/ducks/document-cache/helpers/node/mutate-node-content';

export type PasteNodeParams = {
  documentId: string;
  new_father_id: number;
};

export const pasteNode = (
  state: DocumentCacheState,
  { documentId, new_father_id }: PasteNodeParams,
): DocumentCacheState => {
  const sourceDocument = state.documents[state.copiedNode.documentId];
  const sourceNodes = sourceDocument.nodes;
  const targetDocument = state.documents[documentId];
  const targetNodes = targetDocument.nodes;

  const copiedNode = sourceNodes[state.copiedNode.node_id];
  const newFatherNode = targetNodes[new_father_id];

  const new_node_id = targetDocument.localState.highestNode_id + 1;

  const clone: QFullNode = {
    documentId: targetDocument.id,
    id: `${newNodePrefix}${targetDocument.id}:${new_node_id}`,
    node_id: new_node_id,
    fatherId: newFatherNode.id,
    father_id: newFatherNode.node_id,
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
    tags: copiedNode.tags,
    read_only: copiedNode.read_only,
    node_title_styles: copiedNode.node_title_styles,
    child_nodes: [],
    html: '',
    image: [],
    name: copiedNode.name,
    privacy: copiedNode.privacy,
  };
  if (state.copiedNode.mode === 'copy') {
    createNode(state, { createdNode: clone, previous_sibling_node_id: -1 });
    let images = [];
    let html = copiedNode.html;
    if (copiedNode.image.length) {
      const replacedImageIds: [string, string][] = [];
      let baseId = new Date().getTime();
      images = copiedNode.image.map(image => {
        const newId = (newImagePrefix + baseId++).toString();
        replacedImageIds.push([image.id, newId]);
        return {
          ...image,
          id: newId,
        };
      });
      replacedImageIds.forEach(([oldId, newId]) => {
        html = html.replace(oldId, newId);
      });
    }
    mutateNodeContent(state, {
      node_id: clone.node_id,
      documentId: targetDocument.id,
      data: {
        image: images,
        html: html,
      },
    });
  }
  state.copiedNode = undefined;
  return state;
};

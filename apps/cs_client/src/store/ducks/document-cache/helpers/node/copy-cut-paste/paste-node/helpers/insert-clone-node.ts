import { createNode } from '../../../create-node';
import { newImagePrefix } from '::editor/components/content-editable/hooks/add-meta-to-pasted-images';
import { mutateNodeContent } from '../../../mutate-node-content';
import { DocumentCacheState, QFullNode } from '../../../../../document-cache';

type Props = {
  clone: QFullNode;
  copiedNode: QFullNode;
};

export const insertCloneNode = (
  state: DocumentCacheState,
  { clone, copiedNode }: Props,
) => {
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
    documentId: clone.documentId,
    data: {
      image: images,
      html: html,
    },
  });
};

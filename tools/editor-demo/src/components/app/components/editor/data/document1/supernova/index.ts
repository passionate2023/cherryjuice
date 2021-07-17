import { Node } from '::root/app/components/editor/components/editor-container';
import { html } from '::root/app/components/editor/data/document1/supernova/html';
import { images } from '::root/app/components/editor/data/document1/supernova/images';
export const supernova: Node = {
  meta: {
    node_id: 1,
    documentId: 'demo',
    name: 'supernova',
  },
  content: {
    html,
    images,
  },
};

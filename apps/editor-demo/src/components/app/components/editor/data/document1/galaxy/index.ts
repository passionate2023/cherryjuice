import { Node } from '::root/app/components/editor/components/editor-container';
import { html } from '::root/app/components/editor/data/document1/galaxy/html';
import { images } from '::root/app/components/editor/data/document1/galaxy/images';

export const galaxy: Node = {
  content: { html, images },
  meta: { node_id: 2, documentId: 'demo', name: 'galaxy' },
};

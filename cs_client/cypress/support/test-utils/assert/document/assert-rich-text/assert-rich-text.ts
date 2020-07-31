import { DocumentAst } from '../../../../../fixtures/document/generate-document';
import { assertNodeImage } from './assertions/assert-node-images';
import { assertNodeText } from './assertions/assert-node-text';
import { selectNode } from '../../../../workflows/tree/helpers/select-node';

export const assertRichText = (docAst: DocumentAst) => {
  cy.log('assert-rich-text');
  docAst.tree.forEach(level =>
    level
      .filter(node => node.text || node.images.length)
      .forEach(node => {
        selectNode(node);
        if (node.images.length) assertNodeImage({ node, images: node.images });
        if (node.text) assertNodeText({ text: node.text });
      }),
  );
};

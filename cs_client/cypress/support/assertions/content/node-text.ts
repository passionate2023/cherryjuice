import { selectNode } from '../../workflows/tree/helpers/select-node';
import { DocumentAst } from '../../../fixtures/document/generate-document';
import { assertNodeImage } from './node-image';

export const assertNodeText = ({ node, text }) => {
  selectNode(node);
  cy.get('#rich-text').contains(text);
};

export const assertDocumentText = ({ tree }: DocumentAst) => {
  tree.forEach(nodeAsts => {
    nodeAsts
      .filter(node => node.text)
      .forEach(node => {
        assertNodeText({ node, text: node.text });
      });
  });
};
export const assertDocumentImages = (docAst: DocumentAst) => {
  docAst.tree.forEach(level =>
    level
      .filter(node => node.images.length)
      .forEach(node => {
        assertNodeImage({ node, images: node.images });
      }),
  );
};

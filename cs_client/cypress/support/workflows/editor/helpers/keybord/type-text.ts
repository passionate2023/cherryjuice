import { tree } from '../../../tree/tree';
import { NodeAst } from '../../../../../fixtures/node/generate-node';

const typeText = (nodes: NodeAst[]) => {
  nodes.forEach(node => {
    tree.interactions.selectNode(node);
    cy.get('#rich-text').type(node.text);
  });
};

export { typeText };

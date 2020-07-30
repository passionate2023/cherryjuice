import { tree } from '../../../tree/tree';
import { NodeAst } from '../../../../../fixtures/node/generate-node';

const typeText = (nodes: NodeAst[], clear = false) => {
  nodes
    .filter(node => node.text)
    .forEach(node => {
      tree.interactions.selectNode(node);

      clear
        ? cy
            .get('#rich-text')
            .clear()
            .type(node.text)
        : cy.get('#rich-text').type(node.text);
    });
};

export { typeText };

import { tree } from '../../../tree/tree';

const typeText = ({ node, text }) => {
  tree.interactions.selectNode(node);
  cy.get('#rich-text').type(text);
};

export { typeText };

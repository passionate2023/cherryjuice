import { selectNode } from '../micro/select-node';

export const writeText = ({ node, text }) => {
  selectNode(node);
  cy.get('#rich-text').type(text);
};

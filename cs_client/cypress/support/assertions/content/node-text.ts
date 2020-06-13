import { selectNode } from '../../workflows/micro/select-node';

export const assertNodeText = ({ node, text }) => {
  selectNode(node);
  cy.get('#rich-text').contains(text);
};

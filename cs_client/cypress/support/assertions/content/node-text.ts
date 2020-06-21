import { selectNode } from '../../workflows/tree/helpers/select-node';

export const assertNodeText = ({ node, text }) => {
  selectNode(node);
  cy.get('#rich-text').contains(text);
};

export const assertNodeText = ({ text }) => {
  cy.log('assert-node-text');
  cy.get('#rich-text').contains(text);
};

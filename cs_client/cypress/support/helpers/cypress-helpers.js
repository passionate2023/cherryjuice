/* eslint-disable */
export const wait = {
  ms250: () => {
    cy.wait(250);
  },
  ms500: () => {
    cy.wait(500);
  },
  s1: () => {
    cy.wait(1000);
  },
};
/* eslint-disable */
export const wait = {
  ms250: () => cy.wait(250),
  ms500: () => cy.wait(500),
  s1: () => cy.wait(1000),
  s5: () => cy.wait(5000),
};

export const fixScrolling = () => {
  Cypress.on('scrolled', $el => {
    $el.get(0).scrollIntoView({
      block: 'center',
      inline: 'center',
    });
  });
};

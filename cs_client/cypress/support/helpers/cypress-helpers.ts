/* eslint-disable */
export const wait = {
  get s1() {
    return cy.wait(1000);
  },
  ms250: () => cy.wait(250),
  ms500: () => cy.wait(500),
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

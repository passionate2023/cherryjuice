import { interact } from '../../interact/interact';

export const getNumberOfDocuments = () => {
  return new Cypress.Promise(res => {
    interact.documentsList.show();
    new Cypress.Promise(res => {
      cy.get('.selectFile').then(body$ => {
        const body = body$[0];
        res(body.querySelectorAll('.selectFile__file__name').length);
      });
    }).then(n => {
      interact.documentsList.close();
      res(n);
    });
  });
};

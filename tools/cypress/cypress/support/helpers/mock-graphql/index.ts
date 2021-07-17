// https://github.com/cypress-io/cypress-documentation/issues/122#issuecomment-372760320

import { getAppropriateData } from './data';

const responseStub = result =>
  Promise.resolve({
    json() {
      return Promise.resolve(result);
    },
    text() {
      return Promise.resolve(JSON.stringify(result));
    },
    ok: true,
  });

Cypress.Commands.add('mockGraphQL', () => {
  cy.on('window:before:load', win => {
    const originalFunction = win.fetch;

    function fetch(path, { body, method }) {
      if (path.includes('/graphql') && method === 'POST') {
        // return responseStub(handler(JSON.parse(body)));

        return responseStub(getAppropriateData(body));
      }

      // eslint-disable-next-line prefer-rest-params
      return originalFunction.apply(this, arguments);
    }

    cy.stub(win, 'fetch', fetch).as('graphqlStub');
  });
});

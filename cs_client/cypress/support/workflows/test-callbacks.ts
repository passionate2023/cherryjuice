import { TestCallbacks } from '../../../src/helpers/attach-test-callbacks';
// @ts-ignore
import { Cypress } from 'cypress';
const getTestCallbacks = (): Cypress.Chainable<TestCallbacks> =>
  // @ts-ignore
  cy.window().then(window => window.__testCallbacks);

export { getTestCallbacks };

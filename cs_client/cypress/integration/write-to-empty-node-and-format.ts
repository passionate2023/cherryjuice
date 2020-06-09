import { fileId } from '../support/helpers/mock-graphql/data';

const helpers = {
  wrapInEditor: str => `<div class="rich-text__line" style="">${str}</div>`,
};

const testSample = {
  input: {
    keysToPress: '{control} ',
    textToType: 'hello',
    initialInnerHtml: '',
  },
  output: helpers.wrapInEditor('<strong>hello</strong>'),
};

describe('write to empty editor and format', () => {
  before(() => {
    cy.mockGraphQL();
  });
  it('write to editor', () => {
    cy.visit(`/${fileId}/node-1`)
      .get('#rich-text', { timeout: 20000 })
      .click()
      .invoke('html', testSample.input.initialInnerHtml)
      .type(testSample.input.textToType)
      .type(testSample.input.keysToPress)
      .invoke('html')
      .should('eq', testSample.output);
  });
});

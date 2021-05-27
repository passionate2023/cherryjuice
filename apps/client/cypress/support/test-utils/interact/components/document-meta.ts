import { DocumentAst } from '../../../../fixtures/document/generate-document';
import { wait } from '../../../helpers/cypress-helpers';
import { testIds } from '../../../helpers/test-ids';
import { Privacy } from '@cherryjuice/graphql-types';
import { interact } from '../interact';

const show = (docAst: DocumentAst) => {
  const selector = docAst.meta.id;
  interact.documentsList.show();
  cy.findByText(selector)
    .parent()
    .parent()
    .parent()
    .debug()
    .find('.selectFile__file__three-dots-button')
    .click();
  cy.findByText(selector)
    .parent()
    .parent()
    .parent()
    .find('.selectFile__file__three-dots-popup__item')
    .first()
    .click();
  wait.ms500();
};

const apply = () => {
  cy.findByTestId(testIds.documentMeta__apply).click();
  wait.s1;
  wait.ms500();
};

const set = {
  name: (name: string) => {
    cy.findByTestId(testIds.documentMeta__documentName).clear().type(name);
  },
  privacy: (privacy: Privacy) => {
    cy.findByTestId(testIds.documentMeta__documentPrivacy).select(privacy);
  },
};

const get = {
  guestButton(email: string) {
    return cy
      .findByTestId(testIds.form__chips__chipsList)
      .findByText(email)
      .findByTestId(testIds.documentMeta__guestList__writeButton);
  },
};

export const documentMeta = {
  show,
  set,
  apply,
  get,
};

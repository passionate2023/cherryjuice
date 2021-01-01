import { testIds } from '../../../helpers/test-ids';
import { wait } from '../../../helpers/cypress-helpers';
import { closeModal } from './shared';

const show = () => {
  cy.findByTestId(testIds.toolBar__navBar__documentButton, {
    timeout: 20000,
  }).click({ force: true });
  wait.ms250();
};

export const documentMenu = {
  show,
  close: closeModal,
};

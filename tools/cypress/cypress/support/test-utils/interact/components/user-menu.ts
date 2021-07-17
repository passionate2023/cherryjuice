import { testIds } from '@cherryjuice/test-ids';
import { wait } from '../../../helpers/cypress-helpers';
import { closeModal } from './shared';

const show = () => {
  cy.findByTestId(testIds.toolBar__navBar__userButton, {
    timeout: 20000,
  }).click({ force: true });
  wait.s1;
};

export const userMenu = {
  show,
  close: closeModal,
};

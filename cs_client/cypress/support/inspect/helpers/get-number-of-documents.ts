import { dialogs } from '../../workflows/dialogs/dialogs';

export const getNumberOfDocuments = () => {
  return new Cypress.Promise(res => {
    dialogs.documentsList.show();
    dialogs.documentsList.inspect.getNumberOfDocuments().then(n => {
      dialogs.documentsList.close();
      res(n);
    });
  });
};

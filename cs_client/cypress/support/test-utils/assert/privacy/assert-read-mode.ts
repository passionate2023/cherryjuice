import { testIds } from '../../../helpers/test-ids';

export const assertReadMode = () => {
  cy.document().then(document => {
    const formattingButton = document.querySelector(
      `[data-testid="${testIds.toolBar__main__editNodeMeta}"]`,
    );
    const showDocuments = document.querySelector(
      `[data-testid="${testIds.toolBar__navBar__showDocumentList}"]`,
    );
    expect(showDocuments).to.exist;
    expect(formattingButton).to.not.exist;
  });
};

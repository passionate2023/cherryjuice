const getDocumentInfo = (
  documentName: string,
  id?: string,
): Promise<{ id: string; hash: string }> =>
  new Cypress.Promise(res => {
    cy.findByText(id || documentName)
      .parent()
      .then(parent$ => {
        const parent = parent$[0];
        const hashElement: HTMLSpanElement = parent.querySelector(
          '.selectFile__file__details__hash',
        );
        const idElement: HTMLSpanElement = parent.querySelector(
          '.selectFile__file__details__id',
        );
        res({ id: idElement.innerText, hash: hashElement.innerText });
      });
  });

export { getDocumentInfo };

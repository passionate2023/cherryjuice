const getDocumentInfo = ({
  name,
  id,
  unsaved,
}: {
  name;
  id;
  unsaved: boolean;
}): Promise<{ id: string; hash: string }> =>
  new Cypress.Promise(res => {
    if (unsaved) name = `*${name}`;
    cy.findByText(id || name)
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

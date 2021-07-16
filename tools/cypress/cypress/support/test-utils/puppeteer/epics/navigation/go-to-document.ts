import { DocumentAst } from '../../../../../fixtures/document/generate-document';

export const goToDocument = (
  docAst: DocumentAst,
  { expand } = { expand: true },
) => {
  cy.visit(
    `/document/${docAst.meta.id}${
      expand && docAst.tree.length > 1 ? `?expand=${docAst.tree.length}` : ''
    }`,
  );
  cy.get('.tree', { timeout: 20000 });
};

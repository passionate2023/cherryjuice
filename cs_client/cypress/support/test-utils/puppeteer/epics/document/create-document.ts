import { DocumentAst } from '../../../../../fixtures/document/generate-document';
import { puppeteer } from '../../puppeteer';
import { wait } from '../../../../helpers/cypress-helpers';
import { Privacy } from '../../../../../../types/graphql';
import { interact } from '../../../interact/interact';

export const createDocument = (docAst: DocumentAst) => {
  cy.findByTestId('new-document').click();
  wait.ms500();
  interact.documentMeta.set.name(docAst.meta.name);
  if (docAst.meta.privacy !== Privacy.PRIVATE)
    interact.documentMeta.set.privacy(docAst.meta.privacy);
  interact.documentMeta.apply();
  puppeteer.content.createTree(docAst);
  docAst.tree.forEach(level =>
    level
      .filter(node => node.images.length)
      .forEach(node => {
        puppeteer.content.clipboard.pasteBlobImages({
          node,
          images: node.images.filter((_, i) => i >= node.images.length - 1),
        });
      }),
  );

  docAst.tree.forEach(level =>
    level
      .filter(node => node.images.length)
      .forEach(node => {
        puppeteer.content.clipboard.pasteHtmlImages({
          node,
          images: node.images.filter((_, i) => i < node.images.length - 1),
        });
      }),
  );
  puppeteer.content.setDocumentText(docAst);
};

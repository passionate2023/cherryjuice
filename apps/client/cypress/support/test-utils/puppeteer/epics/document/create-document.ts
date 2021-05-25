import { Privacy } from '@cherryjuice/graphql-types';
import { DocumentAst } from '../../../../../fixtures/document/generate-document';
import { puppeteer } from '../../puppeteer';
import { wait } from '../../../../helpers/cypress-helpers';
import { interact } from '../../../interact/interact';

const createNewDocument = (docAst: DocumentAst) => {
  interact.documentMenu.show();
  cy.findByTestId('new-document').click();
  wait.ms250();
  interact.documentMeta.set.name(docAst.meta.name);
  if (docAst.meta.privacy !== Privacy.PRIVATE)
    interact.documentMeta.set.privacy(docAst.meta.privacy);
  interact.documentMeta.apply();
  wait.ms250();
};

export const createDocument = (docAst: DocumentAst) => {
  createNewDocument(docAst);
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

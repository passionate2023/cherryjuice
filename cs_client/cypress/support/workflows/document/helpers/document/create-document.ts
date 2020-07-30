import { DocumentAst } from '../../../../../fixtures/document/generate-document';
import { dialogs } from '../../../dialogs/dialogs';
import { editor } from '../../../editor/editor';
import { puppeteer } from '../../puppeteer';
import { wait } from '../../../../helpers/cypress-helpers';
import { Privacy } from '../../../../../../types/graphql/generated';

export const createDocument = (docAst: DocumentAst) => {
  cy.findByTestId('new-document').click();
  wait.ms500();
  dialogs.documentMeta.setName(docAst.meta.name);
  if (docAst.meta.privacy !== Privacy.PRIVATE)
    dialogs.documentMeta.setPrivacy(docAst.meta.privacy);
  dialogs.documentMeta.apply();
  // dialogs.documentMeta.create(docAst.meta);
  puppeteer.content.createTree(docAst);
  docAst.tree.forEach(level =>
    level
      .filter(node => node.images.length)
      .forEach(node => {
        editor.clipboard.pasteBlobImages({
          node,
          images: node.images.filter((_, i) => i >= node.images.length - 1),
        });
      }),
  );

  docAst.tree.forEach(level =>
    level
      .filter(node => node.images.length)
      .forEach(node => {
        editor.clipboard.pasteHtmlImages({
          node,
          images: node.images.filter((_, i) => i < node.images.length - 1),
        });
      }),
  );
  puppeteer.content.setDocumentText(docAst);
};

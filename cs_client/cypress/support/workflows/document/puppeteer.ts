import { createTree } from './helpers/tree/create-tree';
import { importLocalFile } from './helpers/import/import-local-file';
import { createDocument } from './helpers/document/create-document';
import { saveDocument } from './helpers/document/save-document';
import { deleteDocuments } from './helpers/document/delete-documents';
import { renameDocument } from './helpers/document/rename-document';
import { goToDocument } from './helpers/navigation/go-to-document';
import { exportDocument } from './helpers/document/export-document';
import { selectDocument } from './helpers/document/select-document';
import { setDocumentPrivacy } from './helpers/document/set-document-privacy';
import { goToLogin } from './helpers/navigation/go-to-login';
import { createImageGenerator } from '../../../fixtures/node/generate-node-content/image/generate-image';
import { editor } from '../editor/editor';
import { DocumentAst } from '../../../fixtures/document/generate-document';
import { signOut } from './helpers/auth/sign-out';
import { signIn } from './helpers/auth/sign-in';
import { dialogs } from '../dialogs/dialogs';
import { NodePrivacy } from '../../../../types/graphql/generated';
import { wait } from '../../helpers/cypress-helpers';

const doOnCondition = isTrue => (testId: string) => (callback: () => void) => {
  cy.document().then(document => {
    const exists = Boolean(document.querySelector(`[data-testid="${testId}"]`));
    if (exists === isTrue) callback();
  });
};

export const doIfExists = doOnCondition(true);
export const doIfNotExists = doOnCondition(false);

const puppeteer = {
  auth: {
    signOut,
    signIn,
  },
  navigate: {
    goToDocument,
    goToLogin,
  },
  io: {
    importLocalFile,
    exportDocument,
  },
  manage: {
    createDocument,
    saveDocument,
    deleteDocuments,
    renameDocument,
    selectDocument,
    setDocumentPrivacy,
  },
  content: {
    createTree,
    addImages(docAst: DocumentAst) {
      const imageGenerator = createImageGenerator(['black'])(['white']);
      docAst.tree[0].forEach(node => {
        const additionalImage = imageGenerator({
          texts: [node.name, 'image x'],
          format: 'image/jpeg',
        });
        node.images.unshift(additionalImage);
        editor.clipboard.pasteHtmlImages({ node, images: [additionalImage] });
      });
    },
    setDocumentText(docAst: DocumentAst, clear = false) {
      docAst.tree.forEach(level => {
        editor.keyboard.typeText(level, clear);
      });
    },
    editTree(
      docAst: DocumentAst,
      changes: {
        editedAttributes: { privacy: NodePrivacy };
        nodeCoordinates: number[];
      }[],
    ) {
      changes.forEach(({ nodeCoordinates, editedAttributes }) => {
        dialogs.nodeMeta.edit({
          editedNode: docAst.tree[nodeCoordinates[0]][nodeCoordinates[1]],
          newAttributes: editedAttributes,
        });
      });
      wait.s1;
    },
  },
};

export { puppeteer };

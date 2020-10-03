import { createTree } from './epics/tree/create-tree';
import { importLocalFile } from './epics/import/import-local-file';
import { createDocument } from './epics/document/create-document';
import { saveDocument } from './epics/document/save-document';
import { deleteDocuments } from './epics/document/delete-documents';
import { renameDocument } from './epics/document/rename-document';
import { goToDocument } from './epics/navigation/go-to-document';
import { exportDocument } from './epics/document/export-document';
import { selectDocument } from './epics/document/select-document';
import {
  GuestAst,
  setDocumentPrivacy,
} from './epics/document/set-document-privacy';
import { goToLogin } from './epics/navigation/go-to-login';
import { createImageGenerator } from '../../../fixtures/node/generate-node-content/image/generate-image';
import { DocumentAst } from '../../../fixtures/document/generate-document';
import { signOut } from './epics/auth/sign-out';
import { signIn } from './epics/auth/sign-in';
import { NodePrivacy } from '../../../../types/graphql';
import { wait } from '../../helpers/cypress-helpers';
import { createNode } from './epics/document/node/create';
import { edit } from './epics/document/node/edit';
import { deleteNode } from './epics/document/node/delete';
import { testIds } from '../../helpers/test-ids';
import { interact } from '../interact/interact';
import { paste } from './epics/clipboard/helpers/paste';
import { pasteHtmlImages } from './epics/clipboard/paste-html-images';
import { pasteBlobImages } from './epics/clipboard/paste-blob-images';

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
    addGuest({ user: { email }, writeAccess }: GuestAst) {
      cy.findByTestId(testIds.documentMeta__addGuest__input).type(email);
      cy.findByTestId(testIds.documentMeta__addGuest__addButton).click();
      interact.documentMeta.get.guestButton(email);
      if (writeAccess) {
        interact.documentMeta.get.guestButton(email).click();
      }
    },
  },
  content: {
    clipboard: {
      paste,
      pasteHtmlImages,
      pasteBlobImages,
    },
    createTree,
    addImages(docAst: DocumentAst) {
      const imageGenerator = createImageGenerator(['black'])(['white']);
      docAst.tree[0].forEach(node => {
        const additionalImage = imageGenerator({
          texts: [node.name, 'image x'],
          format: 'image/jpeg',
        });
        node.images.unshift(additionalImage);
        puppeteer.content.clipboard.pasteHtmlImages({
          node,
          images: [additionalImage],
        });
      });
    },
    setDocumentText(docAst: DocumentAst, clear = false) {
      docAst.tree.forEach(level => {
        interact.editor.typeText(level, clear);
      });
    },
    nodeMeta: {
      create: createNode,
      edit,
      delete: deleteNode,
    },
    editTree(
      docAst: DocumentAst,
      changes: {
        editedAttributes: { privacy: NodePrivacy };
        nodeCoordinates: number[];
      }[],
    ) {
      changes.forEach(({ nodeCoordinates, editedAttributes }) => {
        puppeteer.content.nodeMeta.edit({
          editedNode: docAst.tree[nodeCoordinates[0]][nodeCoordinates[1]],
          newAttributes: editedAttributes,
        });
      });
      wait.s1;
    },
  },
};

export { puppeteer };

import { createNode } from './helpers/node/create';
import { edit } from './helpers/node/edit';
import { deleteNode } from './helpers/node/delete';
import { show } from './helpers/documents-list/interact/show';
import { close } from './helpers/documents-list/interact/close';
import { showDocumentMetaDialog } from './helpers/documents-list/interact/show-document-meta-dialog';
import { getDocumentInfo } from './helpers/documents-list/inspect/get-document-info';
import { createDocument } from './helpers/document/interact/create';
import { renameDocument } from './helpers/document/interact/rename';

const dialogs = {
  node: {
    create: createNode,
    edit,
    delete: deleteNode,
  },
  documentsList: {
    interact: {
      show,
      close,
      showDocumentMetaDialog,
    },
    inspect: {
      getDocumentInfo,
    },
  },
  document: {
    interact: {
      create: createDocument,
      rename: renameDocument,
    },
  },
};

export { dialogs };

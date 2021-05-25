import {
  generateNewDocument,
  GenerateNewDocumentProps,
  generateRootNode,
} from '::app/components/menus/modals/document-dropdown-menu/callbacks/create-document/helpers/new-document';
import { ac } from '::store/store';
import { AlertType } from '::types/react';

export const createDocument = (props: GenerateNewDocumentProps) => {
  try {
    const document = generateNewDocument(props);
    const rootNode = generateRootNode({
      documentId: document.id,
    });
    document.nodes = {
      0: rootNode,
    };
    ac.documentCache.createDocument(document);
    ac.document.setDocumentId(document.id);
  } catch (e) {
    ac.dialogs.setAlert({
      title: 'Could not create a document',
      description: 'please refresh the page',
      type: AlertType.Error,
      error: e,
    });
  }
};

import { useCallback } from 'react';
import {
  generateNewDocument,
  generateRootNode,
} from '::app/components/menus/dialogs/document-meta/helpers/new-document';
import { ac } from '::store/store';
import { AlertType } from '::types/react';

export const useCreateDocument = ({ state, userId }) => {
  return useCallback(() => {
    try {
      const document = generateNewDocument({ state, userId });
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
  }, [state, userId]);
};

import { createIsNotProcessed } from '::hooks/misc/isnot-processed';
import { apolloCache } from '::graphql/cache/apollo-cache';
import { Document } from '::types/graphql/generated';
import { appActionCreators } from '::app/reducer';
import { NodeCached } from '::types/graphql/adapters';
import { useEffect } from 'react';
import { AlertType } from '::types/react';

const createRootNode = (documentId: string): NodeCached => ({
  id: `TEMP:${documentId}:${0}`,
  documentId,
  node_id: 0,
  father_id: -1,
  name: 'root',
  html: '<?xml version="1.0" ?><node><rich_text></rich_text></node>',
  is_richtxt: 0,
  createdAt: 0,
  updatedAt: 0,
  child_nodes: [],
  is_empty: 0,
  node_title_styles: '',
  icon_id: '',
  read_only: 0,
  image: [],
});

const state = {
  documentsCreate: 0,
};

const createDocument = (): Document => {
  return {
    id: `new-document-${state.documentsCreate++}`,
    node: [],
    name: 'new document',
    size: 0,
    hash: '',
    folder: undefined,
    status: undefined,
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
  };
};

type CreateDocumentProps = {
  createDocumentRequestId;
};

const fn = createIsNotProcessed();

const useCreateDocument = ({
  createDocumentRequestId,
}: CreateDocumentProps) => {
  useEffect(() => {
    const isNotProcessed = fn([createDocumentRequestId]);
    if (isNotProcessed) {
      (async (): Promise<void> => {
        try {
          const document = createDocument();
          const rootNode = createRootNode(document.id);
          document.node.push(rootNode);
          apolloCache.node.create(rootNode);
          apolloCache.document.create(document.id, document);
          appActionCreators.selectFile(document.id);
        } catch (e) {
          appActionCreators.setAlert({
            title: 'Could not create a document',
            description: 'please refresh the page',
            type: AlertType.Error,
            error: e,
          });
        }
      })();
    }
  }, [createDocumentRequestId]);
};

export { useCreateDocument };

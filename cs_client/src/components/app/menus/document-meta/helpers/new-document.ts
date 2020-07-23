import { NodeCached } from '::types/graphql-adapters';
import { Document, DocumentOwnerOt } from '::types/graphql/generated';

type GenerateRootNodeProps = {
  documentId: string;
  owner: DocumentOwnerOt;
};
const generateRootNode = ({
  documentId,
  owner,
}: GenerateRootNodeProps): NodeCached => ({
  id: `TEMP:${documentId}:${0}`,
  documentId,
  node_id: 0,
  father_id: -1,
  name: 'root',
  html: '<?xml version="1.0" ?><node><rich_text></rich_text></node>',
  createdAt: new Date().getTime(),
  updatedAt: new Date().getTime(),
  child_nodes: [],
  is_empty: 0,
  node_title_styles: '',
  read_only: 0,
  image: [],
  owner,
});

type GenerateNewDocumentProps = {
  name: string;
  owner: DocumentOwnerOt;
};
const generateNewDocument = ({
  name,
  owner,
}: GenerateNewDocumentProps): Document => {
  return {
    id: `new-document-${new Date().getTime()}`,
    owner,
    node: [],
    name,
    size: 0,
    hash: '',
    folder: 'Unsaved',
    status: undefined,
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
  };
};

export { generateNewDocument, generateRootNode };

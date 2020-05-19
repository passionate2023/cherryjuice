import { NodeCached } from '::types/graphql/adapters';
import { Document } from '::types/graphql/generated';

type GenerateRootNodeProps = {
  documentId: string;
};
const generateRootNode = ({
  documentId,
}: GenerateRootNodeProps): NodeCached => ({
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

type GenerateNewDocumentProps = {
  name: string;
};
const generateNewDocument = ({ name }: GenerateNewDocumentProps): Document => {
  return {
    id: `new-document-${new Date().getTime()}`,
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

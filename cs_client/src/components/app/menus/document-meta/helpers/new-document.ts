import { NodeCached } from '::types/graphql-adapters';
import { Document } from '::types/graphql/generated';
import { TDocumentMetaState } from '::app/menus/document-meta/reducer/reducer';

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
  createdAt: new Date().getTime(),
  updatedAt: new Date().getTime(),
  child_nodes: [],
  node_title_styles: '',
  read_only: 0,
  image: [],
  hash: '',
});

type GenerateNewDocumentProps = {
  state: TDocumentMetaState;
  userId: string;
};
const generateNewDocument = ({
  userId,
  state: { guests, privacy, name },
}: GenerateNewDocumentProps): Document => {
  return {
    userId,
    privacy,
    name,
    guests,
    id: `new-document-${new Date().getTime()}`,
    node: [],
    size: 0,
    hash: '',
    folder: 'Unsaved',
    status: undefined,
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
  };
};

export { generateNewDocument, generateRootNode };

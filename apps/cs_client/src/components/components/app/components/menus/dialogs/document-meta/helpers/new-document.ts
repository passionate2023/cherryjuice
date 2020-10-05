import { NodeCached } from '@cherryjuice/graphql-types';
import { TDocumentMetaState } from '::root/components/app/components/menus/dialogs/document-meta/reducer/reducer';
import { CreateDocumentParams } from '::store/ducks/cache/document-cache/helpers/document/create-document';
import { newNodePrefix } from '::root/components/app/components/editor/document/components/rich-text/hooks/add-meta-to-pasted-images';

type GenerateRootNodeProps = {
  documentId: string;
};
const generateRootNode = ({
  documentId,
}: GenerateRootNodeProps): NodeCached => ({
  id: `${newNodePrefix}${documentId}:${0}`,
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
}: GenerateNewDocumentProps): CreateDocumentParams => {
  return {
    userId,
    privacy,
    name,
    guests,
    id: `new-document-${new Date().getTime()}`,
    size: 0,
    hash: '',
    folder: 'Unsaved',
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
    privateNodes: [],
    nodes: {},
  };
};

export { generateNewDocument, generateRootNode };

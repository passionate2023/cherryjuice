import { createActionCreator as _, createReducer } from 'deox';
import { createActionPrefixer } from '../helpers/shared';
import { documentActionCreators as dac } from '::store/ducks/document';
import { QDocumentMeta, QNodeMeta } from '::graphql/queries/document-meta';
import { documentsListActionCreators as dlac } from '::store/ducks/documents-list';
import {
  createNode,
  CreateNodeParams,
} from '::store/ducks/cache/document-cache/helpers/node/create-node';
import {
  mutateNode,
  MutateNodeParams,
} from '::store/ducks/cache/document-cache/helpers/node/mutate-node';
import {
  addFetchedFields,
  AddHtmlParams,
} from '::store/ducks/cache/document-cache/helpers/node/add-fetched-fields';
import { Image } from '::types/graphql/generated';
import {
  createDocument,
  CreateDocumentParams,
} from '::store/ducks/cache/document-cache/helpers/document/create-document';
import { loadDocument } from '::store/ducks/cache/document-cache/helpers/document/load-document';
import {
  mutateDocument,
  MutateDocumentProps,
} from '::store/ducks/cache/document-cache/helpers/document/mutate-document';
import { SwapNodeIdParams } from '::store/ducks/cache/document-cache/helpers/node/swap-node-id';
import { swapDocumentId } from '::store/ducks/cache/document-cache/helpers/document/swap-document-id';
import {
  deleteNode,
  DeleteNodeParams,
} from './document-cache/helpers/node/delete-node';
import { selectNode } from '::store/ducks/cache/document-cache/helpers/document/select-node';
import { clearSelectedNode } from '::store/ducks/cache/document-cache/helpers/node/clear-selected-node';
import { removeSavedDocuments } from '::store/ducks/cache/document-cache/helpers/document/remove-saved-documents';
import { nodeActionCreators } from '::store/ducks/node';
import { rootActionCreators } from '::store/ducks/root';
import { cloneObj } from '::helpers/editing/execK/helpers';
import { loadDocumentsList } from '::store/ducks/cache/document-cache/helpers/document/load-documents-list';
import produce from 'immer';
import { DocumentMetaTimeline } from '::store/ducks/cache/document-cache/helpers/document/timeline';

const ap = createActionPrefixer('document-cache');

const ac = {
  createDocument: _(
    ap('create-document'),
    _ => (params: CreateDocumentParams) => _(params),
  ),
  mutateDocument: _(
    ap('mutate-document'),
    _ => (changes: MutateDocumentProps) => _(changes),
  ),
  deleteDocument: _(ap('delete-document'), _ => (documentId: string) =>
    _(documentId),
  ),
  swapDocumentId: _(
    ap('swap-document-id'),
    _ => (Ids: { oldId: string; newId: string }) => _(Ids),
  ),

  createNode: _(ap('create-node'), _ => (node: CreateNodeParams) => _(node)),
  addFetchedFields: _(ap('add-fetched-fields'), _ => (node: AddHtmlParams) =>
    _(node),
  ),
  mutateNode: _(ap('mutate-node'), _ => (props: MutateNodeParams) => _(props)),
  swapNodeId: _(ap('swap-node-id'), _ => (param: SwapNodeIdParams) => _(param)),
  deleteNode: _(ap('delete-node'), _ => (param: DeleteNodeParams) => _(param)),
  undoDocumentMeta: _(ap('undo-document-meta')),
  redoDocumentMeta: _(ap('redo-document-meta')),
};

export type NodesDict = { [node_id: number]: QFullNode };
export type QFullNode = QNodeMeta & { html?: string; image?: Image[] };

export type CachedNodesState = {
  created: number[];
  deleted: number[];
  edited: { [node_id: number]: string[] };
  deletedImages: { [node_id: number]: string[] };
};
export type CachedDocumentState = {
  selectedNode_id?: number;
  recentNodes: number[];
  highestNode_id: number;
  editedAttributes: string[];
  editedNodes: CachedNodesState;
  localUpdatedAt: number;
};

export type CachedDocument = Omit<QDocumentMeta, 'node'> & {
  nodes: NodesDict;
  userId: string;
  state: CachedDocumentState;
};

type State = {
  [documentId: string]: CachedDocument;
};

const initialState: State = {};
const dmtl = new DocumentMetaTimeline();
const reducer = createReducer(initialState, _ => [
  ...[
    _(rootActionCreators.resetState, () => ({
      ...cloneObj(initialState),
    })),
  ],
  ...[
    _(dac.fetchFulfilled, (state, { payload }) => loadDocument(state, payload)),
    _(ac.createDocument, (state, { payload }) =>
      createDocument(state, payload),
    ),
    _(ac.mutateDocument, (state, { payload }) =>
      produce(
        state,
        draft => mutateDocument(draft, payload),
        dmtl.add({ documentId: payload.documentId }),
      ),
    ),
    _(ac.deleteDocument, (state, { payload: documentId }) => {
      dmtl.resetDocument(documentId);
      return produce(state, draft => {
        delete draft[documentId];
      });
    }),
    _(ac.swapDocumentId, (state, { payload }) =>
      swapDocumentId(state, payload),
    ),
  ],
  ...[
    _(nodeActionCreators.select, (state, { payload }) =>
      selectNode(state, payload),
    ),
    _(nodeActionCreators.unselect, (state, { payload }) =>
      clearSelectedNode(state, payload),
    ),
    _(
      dac.saveFulfilled,
      (state): State => {
        dmtl.resetAll();
        return removeSavedDocuments(state);
      },
    ),
  ],
  ...[
    _(dlac.fetchDocumentsFulfilled, (state, { payload }) =>
      loadDocumentsList(state, payload),
    ),
  ],
  ...[
    _(ac.addFetchedFields, (state, { payload }) => {
      return addFetchedFields(state, payload);
    }),
    _(ac.createNode, (state, { payload }) => {
      return createNode(state, payload);
    }),
    _(ac.mutateNode, (state, { payload }) => {
      return mutateNode(state, payload);
    }),
    _(ac.swapNodeId, (state, { payload: { node_id, documentId, newId } }) => ({
      ...state,
      [documentId]: {
        ...state[documentId],
        nodes: {
          ...state[documentId].nodes,
          [node_id]: {
            ...state[documentId].nodes[node_id],
            id: newId,
          },
        },
      },
    })),
    _(ac.deleteNode, (state, { payload }) => deleteNode(state, payload)),
    _(ac.undoDocumentMeta, state => dmtl.undo(state)),
    _(ac.redoDocumentMeta, state => dmtl.redo(state)),
  ],
]);

export { reducer as documentCacheReducer, ac as documentCacheActionCreators };
export { State as DocumentCacheState };

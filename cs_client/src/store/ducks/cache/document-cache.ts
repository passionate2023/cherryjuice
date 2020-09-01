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
  mutateNodeContent,
  MutateNodeContentParams,
} from '::store/ducks/cache/document-cache/helpers/node/mutate-node-content';
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
import { removeSavedDocuments } from '::store/ducks/cache/document-cache/helpers/document/remove-saved-documents';
import { nodeActionCreators as nac } from '::store/ducks/node';
import { rootActionCreators as rac } from '::store/ducks/root';
import { cloneObj } from '::helpers/editing/execK/helpers';
import { loadDocumentsList } from '::store/ducks/cache/document-cache/helpers/document/load-documents-list';
import produce from 'immer';
import {
  mutateNodeMeta,
  MutateNodeMetaParams,
} from '::store/ducks/cache/document-cache/helpers/node/mutate-node-meta';
import { TimelinesManager } from '::store/ducks/cache/document-cache/helpers/timeline/timelines-manager';

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
  mutateNodeMeta: _(
    ap('mutate-node-meta'),
    _ => (props: MutateNodeMetaParams | MutateNodeMetaParams[]) => _(props),
  ),
  mutateNodeContent: _(
    ap('mutate-node-content'),
    _ => (props: MutateNodeContentParams) => _(props),
  ),
  swapNodeId: _(ap('swap-node-id'), _ => (param: SwapNodeIdParams) => _(param)),
  deleteNode: _(ap('delete-node'), _ => (param: DeleteNodeParams) => _(param)),
  undoDocumentAction: _(ap('undo-document-action')),
  redoDocumentAction: _(ap('redo-document-action')),
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
export const dTM = new TimelinesManager();
dTM.setOnFrameChangeFactory(() =>
  import('::store/store').then(
    module => module.ac.timelines.setDocumentActionNOF,
  ),
);

const reducer = createReducer(initialState, _ => [
  ...[
    // non undoable actions
    _(rac.resetState, () => ({
      ...cloneObj(initialState),
    })),
    _(dac.fetchFulfilled, (state, { payload }) => loadDocument(state, payload)),
    _(ac.createDocument, (state, { payload }) => createDocument(state, payload)),
    _(ac.swapDocumentId, (state, { payload }) =>
      swapDocumentId(state, payload),
    ),
    _(nac.select, (state, { payload }) => selectNode(state, payload)),
    _(dlac.fetchDocumentsFulfilled, (state, { payload }) =>
      loadDocumentsList(state, payload),
    ),
    _(ac.addFetchedFields, (state, { payload }) =>
      addFetchedFields(state, payload),
    ),
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
    _(ac.mutateNodeContent, (state, { payload }) =>
      mutateNodeContent(state, payload),
    ),
    _(ac.deleteDocument, (state, { payload: documentId }) => {
      dTM.resetTimeline(documentId);
      return produce(state, draft => {
        delete draft[documentId];
      });
    }),
    _(
      dac.saveFulfilled,
      (state): State => {
        dTM.resetAll();
        return removeSavedDocuments(state);
      },
    ),
    _(ac.undoDocumentAction, state => dTM.current.undo(state)),
    _(ac.redoDocumentAction, state => dTM.current.redo(state)),
  ],
  ...[
    // undoable actions
    _(ac.createNode, (state, { payload }) =>
      produce(
        state,
        draft => createNode(draft, payload),
        dTM.addFrame({
          timelineId: payload.createdNode.documentId,
          silent: true,
        }),
      ),
    ),
    _(ac.deleteNode, (state, { payload }) =>
      produce(
        state,
        draft => deleteNode(draft, payload),
        dTM.addFrame({
          timelineId: payload.documentId,
        }),
      ),
    ),
    _(ac.mutateNodeMeta, (state, { payload }) =>
      produce(
        state,
        draft => mutateNodeMeta(draft, payload),
        dTM.addFrame({
          timelineId: Array.isArray(payload)
            ? payload[0].documentId
            : payload.documentId,
        }),
      ),
    ),
    _(ac.mutateDocument, (state, { payload }) =>
      produce(
        state,
        draft => mutateDocument(draft, payload),
        dTM.addFrame({ timelineId: payload.documentId })
      )),
  ],
]);

export { reducer as documentCacheReducer, ac as documentCacheActionCreators };
export { State as DocumentCacheState };

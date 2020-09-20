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
import {
  deleteNode,
  DeleteNodeParams,
} from './document-cache/helpers/node/delete-node';
import {
  selectNode,
  SelectNodeParams,
} from '::store/ducks/cache/document-cache/helpers/document/select-node';
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
import { timelinesActionCreators as tac } from '::store/ducks/timelines';
import {
  collapseNode,
  expandNode,
} from '::store/ducks/cache/document-cache/helpers/node/expand-node/expand-node';
import {
  setScrollPosition,
  SetScrollPositionParams,
} from '::store/ducks/cache/document-cache/helpers/node/set-scroll-position';
import { NodeState } from '::store/ducks/cache/document-cache/helpers/node/expand-node/helpers/tree/tree';
import { DocumentStateTuple } from '::store/tasks/sync-persisted-state';
import { neutralizePersistedState } from '::store/ducks/cache/document-cache/helpers/document/neutralize-persisted-state';
import { selectDocument } from '::store/ducks/cache/document-cache/helpers/document/select-document';

const ap = createActionPrefixer('document-cache');

const ac = {
  expandNode: _(ap('expand-node'), _ => (params: SelectNodeParams) =>
    _(params),
  ),
  collapseNode: _(ap('collapse-node'), _ => (params: SelectNodeParams) =>
    _(params),
  ),
  createDocument: _(
    ap('create-document'),
    _ => (params: CreateDocumentParams) => _(params),
  ),
  mutateDocument: _(
    ap('mutate-document'),
    _ => (changes: MutateDocumentProps) => _(changes),
  ),
  deleteDocuments: _(ap('delete-documents'), _ => (documentIds: string[]) =>
    _(documentIds),
  ),
  createNode: _(ap('create-node'), _ => (node: CreateNodeParams) => _(node)),
  addFetchedFields: _(ap('add-fetched-fields'), _ => (node: AddHtmlParams[]) =>
    _(node),
  ),
  mutateNodeMeta: _(
    ap('mutate-node-meta'),
    _ => (
      props: MutateNodeMetaParams | MutateNodeMetaParams[],
      mutationType?: DocumentMutations,
    ) => _(props, mutationType),
  ),
  mutateNodeContent: _(
    ap('mutate-node-content'),
    _ => (props: MutateNodeContentParams) => _(props),
  ),
  deleteNode: _(ap('delete-node'), _ => (param: DeleteNodeParams) => _(param)),
  setScrollPosition: _(
    ap('set-scroll-position'),
    _ => (param: SetScrollPositionParams) => _(param),
  ),
  undoDocumentAction: _(ap('undo-document-action')),
  redoDocumentAction: _(ap('redo-document-action')),
  neutralizePersistedState: _(
    ap('neutralize-persisted-state'),
    _ => (param: DocumentStateTuple[]) => _(param),
  ),
};

export type NodesDict = { [node_id: number]: QFullNode };
export type QFullNode = QNodeMeta & { html?: string; image?: Image[] };

export type CachedNodesState = {
  created: number[];
  deleted: number[];
  edited: { [node_id: number]: string[] };
  deletedImages: { [node_id: number]: string[] };
};

export type NodeScrollPosition = [number, number];
export type CachedDocumentState = {
  highestNode_id: number;
  editedAttributes: string[];
  editedNodes: CachedNodesState;
  localUpdatedAt: number;
};
export type PersistedDocumentState = {
  selectedNode_id?: number;
  treeState: NodeState;
  scrollPositions: {
    [node_id: number]: NodeScrollPosition;
  };
  recentNodes: number[];
  updatedAt: number;
  localUpdatedAt: number;
  lastOpenedAt: number;
  localLastOpenedAt: number;
};
export type CachedDocument = Omit<QDocumentMeta, 'node' | 'state'> & {
  nodes: NodesDict;
  userId: string;
  localState: CachedDocumentState;
  persistedState: PersistedDocumentState;
};

export type CachedDocumentDict = {
  [documentId: string]: CachedDocument;
};

type State = {
  documents: CachedDocumentDict;
};

export enum DocumentMutations {
  CreateNode = 'created',
  NodeAttributes = 'changed attributes',
  NodeParent = 'changed parent',
  NodeContent = 'changed content',
  DeleteNode = 'deleted',
  DocumentAttributes = 'changed attributes',
}

export type DocumentTimeLineMeta = {
  node_id?: number;
  documentId: string;
  mutationType: DocumentMutations;
};
const initialState: State = {
  documents: {},
};
export const dTM = new TimelinesManager<DocumentTimeLineMeta>(true);
dTM.setOnFrameChangeFactory(() =>
  import('::store/store').then(
    module => module.ac.timelines.setDocumentActionNOF,
  ),
);

const reducer = createReducer(initialState, _ => [
  ...[
    // non undoable actions
    _(rac.resetState, () => {
      dTM.resetAll();
      return {
        ...cloneObj(initialState),
      };
    }),
    _(ac.createDocument, (state, { payload }) => {
      dTM.setCurrent(payload.id);
      return produce(state, draft => createDocument(draft, payload));
    }),
    _(dac.fetchFulfilled, (state, { payload }) =>
      produce(state, draft =>
        selectDocument(
          loadDocument(draft, payload.document, payload.nextNode),
          payload.document.id,
        ),
      ),
    ),
    _(dac.setDocumentId, (state, { payload }) => {
      dTM.setCurrent(payload);
      return produce(state, draft => selectDocument(draft, payload));
    }),
    _(nac.select, (state, { payload }) =>
      produce(state, draft =>
        expandNode(selectNode(draft, payload), {
          ...payload,
          expandChildren: false,
        }),
      ),
    ),
    _(tac.setDocumentActionNOF, (state, { payload }) =>
      // todo: filter mutations
      payload.frame?.meta?.node_id
        ? produce(state, draft =>
            selectNode(draft, payload.frame.meta as SelectNodeParams),
          )
        : state,
    ),
    _(dlac.fetchDocumentsFulfilled, (state, { payload }) =>
      produce(state, draft => loadDocumentsList(draft, payload)),
    ),
    _(ac.addFetchedFields, (state, { payload }) =>
      produce(state, draft => addFetchedFields(draft, payload)),
    ),
    _(ac.undoDocumentAction, state => dTM.current.undo(state)),
    _(ac.redoDocumentAction, state => dTM.current.redo(state)),
    _(ac.expandNode, (state, { payload }) =>
      produce(state, draft => expandNode(draft, payload)),
    ),
    _(ac.collapseNode, (state, { payload }) =>
      produce(state, draft => collapseNode(draft, payload)),
    ),
    _(ac.setScrollPosition, (state, { payload }) =>
      produce(state, draft => setScrollPosition(draft, payload)),
    ),
    _(ac.neutralizePersistedState, (state, { payload }) =>
      produce(state, draft => neutralizePersistedState(draft, payload)),
    ),
  ],
  ...[
    // require cleanup
    _(ac.deleteDocuments, (state, { payload: documentIds }) => {
      return produce(state, draft => {
        documentIds.forEach(documentId => {
          dTM.resetTimeline(documentId);
          delete draft.documents[documentId];
        });
      });
    }),
    _(
      dac.saveFulfilled,
      (state): State => {
        dTM.resetAll();
        return removeSavedDocuments(state);
      },
    ),
  ],
  ...[
    // undoable actions
    _(ac.createNode, (state, { payload }) =>
      produce(
        state,
        draft => createNode(draft, payload),
        dTM.addFrame({
          timelineId: payload.createdNode.documentId,
          node_id: payload.createdNode.node_id,
          documentId: payload.createdNode.documentId,
          mutationType: DocumentMutations.CreateNode,
        }),
      ),
    ),
    _(ac.mutateNodeMeta, (state, { payload, meta }) => {
      const params = Array.isArray(payload) ? payload : [payload];
      const editedOrDroppedNode = params[0];
      let newState = produce(
        produce(
          state,
          draft => mutateNodeMeta(draft, params),
          dTM.addFrame({
            timelineId: editedOrDroppedNode.documentId,
            node_id: editedOrDroppedNode.node_id,
            documentId: editedOrDroppedNode.documentId,
            mutationType: meta || DocumentMutations.NodeAttributes,
          }),
        ),
        draft =>
          selectNode(draft, {
            node_id: editedOrDroppedNode.node_id,
            documentId: editedOrDroppedNode.documentId,
          }),
      );
      if (meta === DocumentMutations.NodeParent) {
        newState = produce(newState, draft =>
          expandNode(draft, {
            node_id: editedOrDroppedNode.node_id,
            documentId: editedOrDroppedNode.documentId,
            expandChildren: true,
          }),
        );
      }
      return newState;
    }),
    _(ac.mutateNodeContent, (state, { payload }) =>
      produce(
        state,
        draft => mutateNodeContent(draft, payload),
        (p, rp) => {
          if (payload.meta?.mode !== 'update-key-only')
            dTM.addFrame({
              timelineId: payload.documentId,
              node_id: payload.node_id,
              documentId: payload.documentId,
              mutationType: DocumentMutations.NodeContent,
            })(p, rp);
        },
      ),
    ),
    _(ac.deleteNode, (state, { payload }) =>
      produce(
        state,
        draft => deleteNode(draft, payload),
        dTM.addFrame({
          timelineId: payload.documentId,
          documentId: payload.documentId,
          node_id: payload.node_id,
          mutationType: DocumentMutations.DeleteNode,
        }),
      ),
    ),
    _(ac.mutateDocument, (state, { payload }) =>
      produce(
        state,
        draft => mutateDocument(draft, payload),
        dTM.addFrame({
          timelineId: payload.documentId,
          documentId: payload.documentId,
          mutationType: DocumentMutations.DocumentAttributes,
        }),
      ),
    ),
  ],
]);

export { reducer as documentCacheReducer, ac as documentCacheActionCreators };
export { State as DocumentCacheState };

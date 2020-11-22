import { createActionCreator as _, createReducer } from 'deox';
import { createActionPrefixer } from '../helpers/shared';
import { documentActionCreators as dac } from '::store/ducks/document';
import { QDocumentMeta, QNodeMeta } from '::graphql/queries/document-meta';
import { documentsListActionCreators as dlac } from '::store/ducks/documents-list';
import {
  createNode,
  CreateNodeParams,
} from '::store/ducks/document-cache/helpers/node/create-node';
import {
  mutateNodeContent,
  MutateNodeContentParams,
} from '::store/ducks/document-cache/helpers/node/mutate-node-content';
import {
  addFetchedFields,
  AddHtmlParams,
} from '::store/ducks/document-cache/helpers/node/add-fetched-fields';
import { Image } from '@cherryjuice/graphql-types';
import {
  createDocument,
  CreateDocumentParams,
} from '::store/ducks/document-cache/helpers/document/create-document';
import { loadDocument } from '::store/ducks/document-cache/helpers/document/load-document';
import {
  mutateDocument,
  MutateDocumentProps,
} from '::store/ducks/document-cache/helpers/document/mutate-document';
import { deleteNode, DeleteNodeParams } from './helpers/node/delete-node';
import {
  closeNode,
  CloseNodeParams,
  selectNode,
  SelectNodeParams,
} from '::store/ducks/document-cache/helpers/document/select-node';
import { removeSavedDocuments } from '::store/ducks/document-cache/helpers/document/remove-saved-documents';
import { nodeActionCreators as nac } from '::store/ducks/node';
import { rootActionCreators as rac } from '::store/ducks/root';
import { cloneObj } from '::helpers/objects';
import { loadDocumentsList } from '::store/ducks/document-cache/helpers/document/load-documents-list';
import produce from 'immer';
import {
  mutateNodeMeta,
  MutateNodeMetaParams,
} from '::store/ducks/document-cache/helpers/node/mutate-node-meta';
import { TimelinesManager } from '::store/ducks/document-cache/helpers/timeline/timelines-manager';
import {
  collapseNode,
  expandNode,
  ExpandNodeParams,
} from '::store/ducks/document-cache/helpers/node/expand-node/expand-node';
import {
  setScrollPosition,
  SetScrollPositionParams,
} from '::store/ducks/document-cache/helpers/node/set-scroll-position';
import { NodeState } from '::store/ducks/document-cache/helpers/node/expand-node/helpers/tree/helpers/expand/expand-node';
import { DocumentStateTuple } from '::store/tasks/sync-persisted-state';
import { neutralizePersistedState } from '::store/ducks/document-cache/helpers/document/neutralize-persisted-state';
import { selectDocument } from '::store/ducks/document-cache/helpers/document/select-document';
import { addBookmark } from '::store/ducks/document-cache/helpers/document/bookmarks/add-bookmark';
import { removeBookmark } from '::store/ducks/document-cache/helpers/document/bookmarks/remove-bookmark';
import {
  moveBookmark,
  MoveBookmarkProps,
} from '::store/ducks/document-cache/helpers/document/bookmarks/move-bookmark';
import { drop } from '::store/ducks/document-cache/helpers/node/drop';
import {
  sortNode,
  SortNodeParams,
} from '::store/ducks/document-cache/helpers/node/sort-node/sort-node';

const ap = createActionPrefixer('document-cache');

const ac = {
  moveBookmark: _(ap('move-bookmark'), _ => (props: MoveBookmarkProps) =>
    _(props),
  ),
  expandNode: _(ap('expand-node'), _ => (params: ExpandNodeParams) =>
    _(params),
  ),
  collapseNode: _(ap('collapse-node'), _ => (params: SelectNodeParams) =>
    _(params),
  ),
  sortNode: _(ap('sort-node'), _ => (params: SortNodeParams) => _(params)),
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
  addBookmark: _(ap('add-bookmark'), _ => (param: SelectNodeParams) =>
    _(param),
  ),
  removeBookmark: _(ap('remove-bookmark'), _ => (param: CloseNodeParams) =>
    _(param),
  ),
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

export type NodesDict = Record<number, QFullNode>;
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
  hash: string;
};
export type PersistedDocumentState = {
  selectedNode_id?: number;
  treeState: NodeState;
  scrollPositions: {
    [node_id: number]: NodeScrollPosition;
  };
  recentNodes: number[];
  bookmarks: number[];
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
  SortNodes = 'sort nodes',
  NodePosition = 'changed position',
  NodeContent = 'changed content',
  DeleteNode = 'deleted',
  DocumentAttributes = 'changed attributes',
  RemoveBookmark = 'removed bookmark',
  AddBookmark = 'added bookmark',
}

export type DocumentTimeLineMeta = {
  node_id?: number;
  documentId: string;
  mutationType: DocumentMutations;
  timeStamp: number;
};
const initialState: State = {
  documents: {},
};
export const dTM = new TimelinesManager<DocumentTimeLineMeta, State>(true, {
  maximumNumberOfFrames: 20,
});
dTM.setOnFrameChangeFactory(() =>
  import('::store/store').then(
    module => module.ac.timelines.setDocumentActionNOF,
  ),
);

const reducer = createReducer(initialState, _ => {
  return [
    ...[
      // non undoable actions
      _(dac.fetchFulfilled, (state, { payload }) =>
        produce(state, draft =>
          selectDocument(
            loadDocument(draft, payload.document, payload.nextNode),
            payload.document.id,
          ),
        ),
      ),
      _(nac.select, (state, { payload }) =>
        produce(state, draft =>
          expandNode(selectNode(draft, payload), {
            ...payload,
            expandChildren: false,
          }),
        ),
      ),
      _(nac.close, (state, { payload }) =>
        produce(state, draft =>
          expandNode(closeNode(draft, payload), {
            documentId: payload.documentId,
            node_id:
              state.documents[payload.documentId].persistedState
                .selectedNode_id,
            expandChildren: false,
          }),
        ),
      ),
      _(dlac.fetchDocumentsFulfilled, (state, { payload }) =>
        produce(state, draft => loadDocumentsList(draft, payload)),
      ),
      _(ac.addFetchedFields, (state, { payload }) =>
        produce(state, draft => addFetchedFields(draft, payload)),
      ),
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
      _(ac.undoDocumentAction, state => dTM.undo(state)),
      _(ac.redoDocumentAction, state => dTM.redo(state)),
      _(ac.moveBookmark, (state, { payload }) =>
        produce(state, draft => moveBookmark(draft, payload)),
      ),
    ],
    ...[
      // require setup
      _(ac.createDocument, (state, { payload }) => {
        dTM.setCurrent(payload.id);
        return produce(state, draft => createDocument(draft, payload));
      }),
      _(dac.setDocumentId, (state, { payload }) => {
        dTM.setCurrent(payload);
        return produce(state, draft => selectDocument(draft, payload));
      }),
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
      _(rac.resetState, () => {
        dTM.resetAll();
        return {
          ...cloneObj(initialState),
        };
      }),
    ],
    ...[
      // undoable actions
      _(ac.createNode, (state, { payload }) =>
        produce(
          state,
          draft => selectNode(createNode(draft, payload), payload.createdNode),
          dTM.addFrame({
            timelineId: payload.createdNode.documentId,
            node_id: payload.createdNode.node_id,
            documentId: payload.createdNode.documentId,
            mutationType: DocumentMutations.CreateNode,
            timeStamp: Date.now(),
          }),
        ),
      ),
      _(ac.mutateNodeMeta, (state, { payload, meta }) => {
        const params = Array.isArray(payload) ? payload : [payload];
        const editedNode = params[0];
        return produce(
          state,
          draft =>
            selectNode(mutateNodeMeta(draft, params), {
              node_id: editedNode.node_id,
              documentId: editedNode.documentId,
            }),
          dTM.addFrame({
            timelineId: editedNode.documentId,
            node_id: editedNode.node_id,
            documentId: editedNode.documentId,
            mutationType: meta || DocumentMutations.NodeAttributes,
            timeStamp: Date.now(),
          }),
        );
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
                timeStamp: Date.now(),
              })(p, rp);
          },
        ),
      ),
      _(nac.drop, (state, { payload }) => {
        let newState = produce(
          state,
          draft => drop(draft, payload),
          dTM.addFrame({
            timelineId: payload.meta.documentId,
            node_id: +payload.source.id,
            documentId: payload.meta.documentId,
            mutationType: DocumentMutations.NodePosition,
            timeStamp: Date.now(),
          }),
        );
        newState = produce(newState, draft =>
          expandNode(draft, {
            node_id: +payload.source.id,
            documentId: payload.meta.documentId,
            expandChildren: true,
          }),
        );

        return newState;
      }),
      _(ac.deleteNode, (state, { payload }) =>
        produce(
          state,
          draft => deleteNode(draft, payload),
          dTM.addFrame({
            timelineId: payload.documentId,
            documentId: payload.documentId,
            node_id: payload.node_id,
            mutationType: DocumentMutations.DeleteNode,
            timeStamp: Date.now(),
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
            timeStamp: Date.now(),
          }),
        ),
      ),
      _(ac.addBookmark, (state, { payload }) =>
        produce(
          state,
          draft => addBookmark(draft, payload),
          dTM.addFrame({
            timelineId: payload.documentId,
            documentId: payload.documentId,
            node_id: payload.node_id,
            mutationType: DocumentMutations.AddBookmark,
            timeStamp: Date.now(),
          }),
        ),
      ),
      _(ac.removeBookmark, (state, { payload }) =>
        produce(
          state,
          draft => removeBookmark(draft, payload),
          dTM.addFrame({
            timelineId: payload.documentId,
            documentId: payload.documentId,
            node_id: payload.node_id,
            mutationType: DocumentMutations.RemoveBookmark,
            timeStamp: Date.now(),
          }),
        ),
      ),
      _(ac.sortNode, (state, { payload }) =>
        produce(
          state,
          draft => sortNode(draft, payload),
          dTM.addFrame({
            timelineId: payload.documentId,
            documentId: payload.documentId,
            node_id: payload.node_id,
            mutationType: DocumentMutations.SortNodes,
            timeStamp: Date.now(),
          }),
        ),
      ),
    ],
  ];
});

export { reducer as documentCacheReducer, ac as documentCacheActionCreators };
export { State as DocumentCacheState };

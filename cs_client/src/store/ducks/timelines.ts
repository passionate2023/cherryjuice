import { createActionCreator as _, createReducer } from 'deox';
import { createActionPrefixer } from './helpers/shared';
import { NumberOfFrames } from '::root/components/app/components/editor/tool-bar/components/groups/main-buttons/undo-redo/helpers/snapback/snapback/snapback';

const ap = createActionPrefixer('timelines');

const ac = {
  setNodeMetaStatus: _(
    ap('set-node-meta-status'),
    _ => (params: NumberOfFrames) => _(params),
  ),
  showNodeMetaUndoAction: _(ap('show-node-meta-undo-action')),
  hideNodeMetaUndoAction: _(ap('hide-node-meta-undo-action')),

  setDocumentMetaStatus: _(
    ap('set-document-meta-status'),
    _ => (params: NumberOfFrames) => _(params),
  ),
  showDocumentMetaUndoAction: _(ap('show-document-meta-undo-action')),
  hideDocumentMetaUndoAction: _(ap('hide-document-meta-undo-action')),
};

type State = {
  nodeMetaNumberOfFrames: NumberOfFrames;
  showNodeMetaUndoAction: boolean;
  documentMetaNumberOfFrames: NumberOfFrames;
  showDocumentMetaUndoAction: boolean;
};

const initialState: State = {
  nodeMetaNumberOfFrames: { undo: 0, redo: 0 },
  showNodeMetaUndoAction: false,
  documentMetaNumberOfFrames: { undo: 0, redo: 0 },
  showDocumentMetaUndoAction: false,
};
const reducer = createReducer(initialState, _ => [
  _(ac.setNodeMetaStatus, (state, { payload }) => ({
    ...state,
    nodeMetaNumberOfFrames: payload,
    showNodeMetaUndoAction: true,
  })),
  _(ac.showNodeMetaUndoAction, state => ({
    ...state,
    showNodeMetaUndoAction: true,
  })),
  _(ac.hideNodeMetaUndoAction, state => ({
    ...state,
    showNodeMetaUndoAction: false,
  })),

  _(ac.setDocumentMetaStatus, (state, { payload }) => ({
    ...state,
    documentMetaNumberOfFrames: payload,
    showDocumentMetaUndoAction: true,
  })),
  _(ac.showDocumentMetaUndoAction, state => ({
    ...state,
    showDocumentMetaUndoAction: true,
  })),
  _(ac.hideDocumentMetaUndoAction, state => ({
    ...state,
    showDocumentMetaUndoAction: false,
  })),
]);

export { reducer as timelinesReducer, ac as timelinesActionCreators };

import { createActionCreator as _, createReducer } from 'deox';
import { createActionPrefixer } from './helpers/shared';
import { NumberOfFrames } from '::root/components/app/components/editor/tool-bar/components/groups/main-buttons/undo-redo/helpers/snapback/snapback/snapback';
import { Frame } from '::store/ducks/cache/document-cache/helpers/timeline/timeline';
import { DocumentTimeLineMeta } from '::store/ducks/cache/document-cache';

const ap = createActionPrefixer('timelines');

const ac = {
  setDocumentActionNOF: _(
    ap('set-document-action-nof'),
    _ => (params: NumberOfFrames, frame?: Frame<DocumentTimeLineMeta>) =>
      _({ nof: params, frame }),
  ),
  showUndoDocumentAction: _(ap('show-undo-document-action')),
  hideUndoDocumentAction: _(ap('hide-undo-document-action')),
};

type State = {
  documentActionNOF: NumberOfFrames;
  showUndoDocumentAction: boolean;
};

const initialState: State = {
  documentActionNOF: { undo: 0, redo: 0 },
  showUndoDocumentAction: false,
};
const reducer = createReducer(initialState, _ => [
  _(ac.setDocumentActionNOF, (state, { payload }) => ({
    ...state,
    documentActionNOF: payload.nof,
    showUndoDocumentAction: Boolean(payload.nof.undo || payload.nof.redo),
  })),
  _(ac.showUndoDocumentAction, state => ({
    ...state,
    showUndoDocumentAction: true,
  })),
  _(ac.hideUndoDocumentAction, state => ({
    ...state,
    showUndoDocumentAction: false,
  })),
]);

export { reducer as timelinesReducer, ac as timelinesActionCreators };

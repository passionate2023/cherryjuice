import { createActionCreator as _, createReducer } from 'deox';
import { createActionPrefixer } from './helpers/shared';
import { NumberOfFrames } from '::root/components/app/components/editor/tool-bar/components/groups/main-buttons/undo-redo/helpers/snapback/snapback/snapback';
import { Frame } from '::store/ducks/cache/document-cache/helpers/timeline/timeline';
import { DocumentTimeLineMeta } from '::store/ducks/cache/document-cache';
import { rootActionCreators as rac } from '::store/ducks/root';
import { cloneObj } from '::helpers/objects';
import { documentActionCreators as dac } from '::store/ducks/document';

const ap = createActionPrefixer('timelines');

const ac = {
  setDocumentActionNOF: _(
    ap('set-document-action-nof'),
    _ => (params: NumberOfFrames, frame?: Frame<DocumentTimeLineMeta>) =>
      _({ nof: params, frame }),
  ),
  showUndoDocumentAction: _(ap('show-undo-document-action')),
  hideUndoDocumentAction: _(ap('hide-undo-document-action')),
  showTimeline: _(ap('show-timeline')),
  hideTimeline: _(ap('hide-timeline')),
  toggleTimeline: _(ap('toggle-timeline')),
};

type State = {
  documentActionNOF: NumberOfFrames;
  showUndoDocumentAction: boolean;
  showTimeline: boolean;
};

const initialState: State = {
  documentActionNOF: { undo: 0, redo: 0 },
  showUndoDocumentAction: false,
  showTimeline: false,
};
const reducer = createReducer(initialState, _ => [
  _(rac.resetState, () => ({
    ...cloneObj(initialState),
  })),
  _(
    dac.saveFulfilled,
    (): State => ({
      ...cloneObj(initialState),
    }),
  ),
  _(ac.setDocumentActionNOF, (state, { payload }) => ({
    ...state,
    documentActionNOF: payload.nof,
  })),
  _(ac.showUndoDocumentAction, state => ({
    ...state,
    showUndoDocumentAction: true,
  })),
  _(ac.hideUndoDocumentAction, state => ({
    ...state,
    showUndoDocumentAction: false,
  })),
  _(ac.showTimeline, state => ({
    ...state,
    showTimeline: true,
  })),
  _(ac.hideTimeline, state => ({
    ...state,
    showTimeline: false,
  })),
  _(ac.toggleTimeline, state => ({
    ...state,
    showTimeline: !state.showTimeline,
  })),
]);

export { reducer as timelinesReducer, ac as timelinesActionCreators };

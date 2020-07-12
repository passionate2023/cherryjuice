import { createActionCreator as _, createReducer } from 'deox';
import { createActionPrefixer } from './helpers/shared';

const ap = createActionPrefixer('css-variables');

const ac = {
  setSearchFiltersHeight: _(
    ap('set-search-filters-height'),
    _ => (height: number) => _(height),
  ),
  setDialogBodyHeight: _(ap('set-dialog-body-height'), _ => (height: number) =>
    _(height),
  ),
};

type State = {
  searchFiltersHeight: number;
  dialogBodyHeight: number;
};

const initialState: State = {
  searchFiltersHeight: 230,
  dialogBodyHeight: 500,
};
const reducer = createReducer(initialState, _ => [
  _(ac.setSearchFiltersHeight, (state, { payload }) => ({
    ...state,
    searchFiltersHeight: payload,
  })),
  _(ac.setDialogBodyHeight, (state, { payload }) => ({
    ...state,
    dialogBodyHeight: payload,
  })),
]);

export { reducer as cssVariablesReducer, ac as cssVariablesActionCreators };

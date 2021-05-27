import { createActionCreator as _, createReducer } from 'deox';
import { createActionPrefixer } from './helpers/shared';
import produce from 'immer';
import { rootActionCreators as rac } from '::store/ducks/root';
import { cloneObj } from '@cherryjuice/shared-helpers';

export enum CssVariables {
  vh = 'vh',
  vw = 'vw',
  treeWidth = 'treeWidth',
  treeHeight = 'treeHeight',
  nodePath = 'nodePath',
}

const ap = createActionPrefixer('css-variables');

const ac = {
  set: _(ap('set'), _ => (variable: CssVariables, value: string | number) =>
    _({ variable, value }),
  ),
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
  vh: number;
  vw: number;
  nodePath: number;
  previous: {
    treeWidth: number;
  };
};

const initialState: State = {
  searchFiltersHeight: 230,
  dialogBodyHeight: 500,
  vh: 1,
  vw: 1,
  nodePath: 30,
  previous: {
    treeWidth: 250,
  },
};
const reducer = createReducer(initialState, _ => [
  _(rac.resetState, () => ({
    ...cloneObj(initialState),
  })),
  _(ac.setSearchFiltersHeight, (state, { payload }) => ({
    ...state,
    searchFiltersHeight: payload,
  })),
  _(ac.setDialogBodyHeight, (state, { payload }) => ({
    ...state,
    dialogBodyHeight: payload,
  })),
  _(ac.set, (state, { payload }) =>
    produce(state, draft => {
      draft[payload.variable] = payload.value as number;
    }),
  ),
]);

export { reducer as cssVariablesReducer, ac as cssVariablesActionCreators };

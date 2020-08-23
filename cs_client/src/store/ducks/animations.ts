import { createActionCreator as _, createReducer } from 'deox';
import { createActionPrefixer } from './helpers/shared';

export enum Animations {
  search = 'search',
}

const ap = createActionPrefixer('animations');

const ac = {
  onStart: _(ap('on-start'), _ => (animationName: Animations, show: boolean) =>
    _({ animationName, show }),
  ),
  onRest: _(ap('on-rest'), _ => (animationName: Animations, show: boolean) =>
    _({ animationName, show }),
  ),
};

type State = {};

const initialState: State = {};
const reducer = createReducer(initialState, () => []);

export { reducer as animationReducer, ac as animationActionCreators };

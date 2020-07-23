import { createActionCreator as _, createReducer } from 'deox';
import { createActionPrefixer } from './helpers/shared';

const ap = createActionPrefixer('cache');

const ac = {
  updateDocumentOwner: _(
    ap('update-document-owner'),
    _ => (isPublic: boolean) => _(isPublic),
  ),
};

type State = {};

const initialState: State = {};
const reducer = createReducer(initialState, () => []);

export { reducer as cacheReducer, ac as cacheActionCreators };

import { createActionCreator as _, createReducer } from 'deox';
import { createActionPrefixer } from './helpers/shared';

const ap = createActionPrefixer('cache');

const ac = {
  updateDocumentPrivacy: _(
    ap('update-document-privacy'),
    _ => (isPublic: boolean) => _(isPublic),
  ),
};

type State = {};

const initialState: State = {};
const reducer = createReducer(initialState, () => []);

export { reducer as cacheReducer, ac as cacheActionCreators };

import { cloneObj } from '::helpers/editing/execK/helpers';
import { nodeHelpers } from '::graphql/cache/helpers/node';
import { cacheInitialState, CacheState } from '::graphql/cache/initial-state';
import { changesHelpers } from '::graphql/cache/helpers/changes';
import { documentHelpers } from '::graphql/cache/helpers/document';
import { imageHelpers } from '::graphql/cache/helpers/image';

const apolloCache = (() => {
  const state: CacheState = {
    ...cloneObj<CacheState>(cacheInitialState),
  };
  return {
    __setCache: cache => (state.cache = cache),
    __resetCache: async () => await state.cache.reset(),
    node: nodeHelpers(state),
    image: imageHelpers(state),
    document: documentHelpers(state),
    changes: changesHelpers(state),
  };
})();

export { apolloCache };
if (process.env.NODE_ENV === 'development') {
  // @ts-ignore
  window.__APOLLO_CACHE__ = apolloCache;
}

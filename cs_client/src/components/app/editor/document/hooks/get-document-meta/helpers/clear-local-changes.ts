import { documentActionCreators } from '::app/editor/document/reducer/action-creators';
import { apolloCache } from '::graphql/cache/apollo-cache';
import { localChanges } from '::graphql/cache/helpers/changes';

const clearLocalChanges = () => {
  apolloCache.node.deletedAllModified();
  apolloCache.changes.unsetModificationFlag(localChanges.ALL);
  documentActionCreators.resetCacheUpdated();
};

export { clearLocalChanges };

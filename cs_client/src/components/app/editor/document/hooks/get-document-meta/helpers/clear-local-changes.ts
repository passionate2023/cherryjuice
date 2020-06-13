import { apolloCache } from '::graphql/cache/apollo-cache';
import { localChanges } from '::graphql/cache/helpers/changes';

const clearLocalChanges = async () => {
  apolloCache.node.deletedAllModified();
  apolloCache.changes.unsetModificationFlag(localChanges.ALL);
  await apolloCache.client.resetCache();
};

export { clearLocalChanges };

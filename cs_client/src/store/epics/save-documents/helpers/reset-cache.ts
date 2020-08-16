import { apolloCache } from '::graphql/cache/apollo-cache';

const resetCache = async (): Promise<void> => {
  await apolloCache.client.resetCache();
};

export { resetCache };

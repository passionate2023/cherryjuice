import { apolloClient } from '::graphql/client/apollo-client';

const resetCache = async (): Promise<void> => {
  await apolloClient.resetCache();
};

export { resetCache };

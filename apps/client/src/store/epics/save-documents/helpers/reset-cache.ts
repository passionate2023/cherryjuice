import { apolloClient } from '::graphql/client/apollo-client';
import { pagesManager } from '@cherryjuice/editor';

const resetCache = async (): Promise<void> => {
  await apolloClient.resetCache();
  pagesManager.resetPages(() => true);
};

export { resetCache };

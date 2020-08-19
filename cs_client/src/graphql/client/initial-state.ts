import { ApolloClient } from 'apollo-client';

type CacheState = {
  cache: any;
  client: ApolloClient<any>;
};

const cacheInitialState: CacheState = {
  cache: undefined,
  client: undefined,
};
export { cacheInitialState };
export { CacheState };

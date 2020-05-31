import { cloneObj } from '::helpers/editing/execK/helpers';
import { nodeHelpers } from '::graphql/cache/helpers/node';
import { cacheInitialState, CacheState } from '::graphql/cache/initial-state';
import { changesHelpers } from '::graphql/cache/helpers/changes';
import { documentHelpers } from '::graphql/cache/helpers/document';
import { imageHelpers } from '::graphql/cache/helpers/image';
import { DocumentNode } from 'graphql';
import { ApolloClient } from 'apollo-client';
import { FetchPolicy } from 'apollo-client/core/watchQueryOptions';
import { GqlDataPath } from '::types/misc';

const apolloCache = (() => {
  const state: CacheState = {
    ...cloneObj<CacheState>(cacheInitialState),
  };
  return {
    __setCache: (cache: any) => (state.cache = cache),
    __setClient: (client: ApolloClient<any>) => (state.client = client),
    __resetCache: async () => await state.cache.reset(),
    __state: (() => ({
      get modifications() {
        return cloneObj(state.modifications);
      },
      cache: state.cache,
    }))(),
    client: {
      query: <T, U>(args: {
        path: GqlDataPath<U>;
        query: DocumentNode;
        variables: T;
        fetchPolicy: FetchPolicy;
      }): Promise<U> =>
        state.client.query(args).then(({ data }) => args.path(data)),
      mutate: <T, U>(args: {
        path: (data: any) => U | undefined;
        query: DocumentNode;
        variables: T;
      }): Promise<U> =>
        state.client
          .mutate({
            variables: args.variables,
            mutation: args.query,
          })
          .then(({ data }) => args.path(data)),
    },
    node: nodeHelpers(state),
    image: imageHelpers(state),
    document: documentHelpers(state),
    changes: changesHelpers(state),
  };
})();

export { apolloCache };

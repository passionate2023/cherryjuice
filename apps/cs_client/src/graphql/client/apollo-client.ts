import { cloneObj } from '@cherryjuice/shared-helpers';
import { cacheInitialState, CacheState } from '::graphql/client/initial-state';
import { DocumentNode } from 'graphql';
import { ApolloClient } from 'apollo-client';
import { FetchPolicy } from 'apollo-client/core/watchQueryOptions';
import { GqlDataPath } from '::types/misc';

export type GraphqlArgsPipe<T, U> = (
  variables?: T,
) => GraphqlMutationArgs<T, U> | GraphqlQueryArgs<T, U>;

export type GraphqlMutationArgs<T, U> = {
  path: GqlDataPath<U>;
  query: DocumentNode;
  variables: T;
};
export type GraphqlQueryArgs<T, U> = {
  path: GqlDataPath<U>;
  query: DocumentNode;
  variables: T;
  fetchPolicy: FetchPolicy;
};
export type GraphqlMutation = <T, U>(
  args: GraphqlMutationArgs<T, U>,
  signal?: AbortSignal,
) => Promise<U>;
export type GraphqlQuery = <T, U>(
  args: GraphqlQueryArgs<T, U>,
  signal?: AbortSignal,
) => Promise<U>;

const apolloClient = (() => {
  const state: CacheState = {
    ...cloneObj(cacheInitialState),
  };
  const query: GraphqlQuery = (args, signal) =>
    state.client
      .query({
        ...args,
        context: {
          fetchOptions: {
            signal,
          },
        },
      })
      .then(({ data }) => args.path(data));
  const mutate: GraphqlMutation = (args, signal) =>
    state.client
      .mutate({
        variables: args.variables,
        mutation: args.query,
        context: {
          fetchOptions: {
            signal,
          },
        },
      })
      .then(({ data }) => args.path(data));
  return {
    query,
    mutate,
    resetCache: async () => await state.cache.reset(),
    setClient: (client: ApolloClient<any>) => {
      state.client = client;
      state.cache = client.cache;
    },
  };
})();

export { apolloClient };

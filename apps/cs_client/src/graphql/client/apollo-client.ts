import { cloneObj } from '@cherryjuice/shared-helpers';
import { cacheInitialState, CacheState } from '::graphql/client/initial-state';
import { DocumentNode } from 'graphql';
import { ApolloClient, FetchPolicy } from '@apollo/client/core';
import { GqlDataPath } from '::types/misc';
import { Observable } from '@apollo/client/utilities';
import { FetchResult } from '@apollo/client/link/core';

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

export type GraphqlSubscriptionArgs<T, U> = GraphqlMutationArgs<T, U> & {};

export type GraphqlMutation = <T, U>(
  args: GraphqlMutationArgs<T, U>,
  signal?: AbortSignal,
) => Promise<U>;

export type GraphqlQuery = <T, U>(
  args: GraphqlQueryArgs<T, U>,
  signal?: AbortSignal,
) => Promise<U>;

export type GraphqlSubscription = <T, U>(
  args: GraphqlSubscriptionArgs<T, U>,
  signal?: AbortSignal,
) => Observable<FetchResult<U>>;

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
  const subscribe: GraphqlSubscription = (args, signal) =>
    state.client.subscribe({
      variables: args.variables,
      query: args.query,
      context: {
        fetchOptions: {
          signal,
        },
      },
    });

  return {
    query,
    mutate,
    subscribe,
    resetCache: async () => await state.cache.reset(),
    setClient: (client: ApolloClient<any>) => {
      state.client = client;
      state.cache = client.cache;
    },
  };
})();

export { apolloClient };

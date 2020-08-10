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
) => Promise<U>;
export type GraphqlQuery = <T, U>(args: GraphqlQueryArgs<T, U>) => Promise<U>;

const apolloCache = (() => {
  const state: CacheState = {
    ...cloneObj<CacheState>(cacheInitialState),
  };
  const query: GraphqlQuery = args =>
    state.client.query(args).then(({ data }) => args.path(data));
  const mutate: GraphqlMutation = args =>
    state.client
      .mutate({
        variables: args.variables,
        mutation: args.query,
      })
      .then(({ data }) => args.path(data));
  return {
    __state__: state,
    client: {
      resetCache: async () => await state.cache.reset(),
      set: (client: ApolloClient<any>) => {
        state.client = client;
        state.cache = client.cache;
      },
      query,
      mutate,
    },
    node: nodeHelpers(state),
    image: imageHelpers(state),
    document: documentHelpers(state),
    changes: changesHelpers(state),
  };
})();

export { apolloCache };

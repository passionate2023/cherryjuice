import { DocumentNode } from 'graphql';
import { from } from 'rxjs';
import { apolloCache } from '::graphql/cache/apollo-cache';
import { GqlDataPath } from '::types/misc';

const gqlQuery = <Variables, Data>({
  query,
  variables,
  path,
}: {
  query: DocumentNode;
  path: GqlDataPath<Data>;
  variables?: Variables;
}) =>
  from(
    apolloCache.client.query<Variables, Data>({
      query,
      path,
      variables,
      fetchPolicy: 'network-only',
    }),
  );

export { gqlQuery };

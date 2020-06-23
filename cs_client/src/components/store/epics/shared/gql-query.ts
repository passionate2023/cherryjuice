import { DocumentNode } from 'graphql';
import { from } from 'rxjs';
import { apolloCache } from '::graphql/cache/apollo-cache';
import { GqlDataPath } from '::types/misc';

type OperationArguments<Data, Variables> = {
  query: DocumentNode;
  path: GqlDataPath<Data>;
  variables: Variables;
};
const gqlQuery = <Variables, Data>(args: OperationArguments<Data, Variables>) =>
  from(
    apolloCache.client.query<Variables, Data>({
      ...args,
      fetchPolicy: 'network-only',
    }),
  );
const gqlMutation = <Variables, Data>(
  args: OperationArguments<Data, Variables>,
) =>
  from(
    apolloCache.client.mutate<Variables, Data>({
      ...args,
    }),
  );

export { gqlQuery, gqlMutation };

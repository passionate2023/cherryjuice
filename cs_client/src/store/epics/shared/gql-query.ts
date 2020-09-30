import { DocumentNode } from 'graphql';
import { defer, from } from 'rxjs';
import { apolloClient } from '::graphql/client/apollo-client';
import { GqlDataPath } from '::types/misc';

type GqlOperationArguments<Data, Variables> = {
  query: DocumentNode;
  path: GqlDataPath<Data>;
  variables: Variables;
};
const gqlQuery$ = <Variables, Data>(
  args: GqlOperationArguments<Data, Variables>,
) =>
  defer(() =>
    from(
      apolloClient.query<Variables, Data>({
        ...args,
        fetchPolicy: 'no-cache',
      }),
    ),
  );
const gqlMutation$ = <Variables, Data>(
  args: GqlOperationArguments<Data, Variables>,
) =>
  defer(() =>
    from(
      apolloClient.mutate<Variables, Data>({
        ...args,
      }),
    ),
  );

export { gqlQuery$, gqlMutation$ };
export { GqlOperationArguments };

import { DocumentNode } from 'graphql';
import { defer } from 'rxjs';
import { apolloClient } from '::graphql/client/apollo-client';
import { GqlDataPath } from '::types/misc';
import { cancelablePromise$ } from '::store/epics/shared/custom-observables/cancelable-promise';

type GqlOperationArguments<Data, Variables> = {
  query: DocumentNode;
  path: GqlDataPath<Data>;
  variables: Variables;
};
const gqlQuery$ = <Variables, Data>(
  args: GqlOperationArguments<Data, Variables>,
) => {
  return defer(() =>
    cancelablePromise$(signal =>
      apolloClient.query<Variables, Data>(
        {
          ...args,
          fetchPolicy: 'no-cache',
        },
        signal,
      ),
    ),
  );
};
const gqlMutation$ = <Variables, Data>(
  args: GqlOperationArguments<Data, Variables>,
) =>
  defer(() =>
    cancelablePromise$(signal =>
      apolloClient.mutate<Variables, Data>(
        {
          ...args,
        },
        signal,
      ),
    ),
  );

export { gqlQuery$, gqlMutation$ };
export { GqlOperationArguments };

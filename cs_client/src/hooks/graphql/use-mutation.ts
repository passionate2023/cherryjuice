import { apolloCache, GraphqlArgsPipe } from '::graphql/cache/apollo-cache';
import { ApolloError } from 'apollo-client';
import { AsyncOperation } from '::store/ducks/document';
import { useCallback, useState } from 'react';

type UseMutation = <T, U>(args: {
  gqlPipe: GraphqlArgsPipe<T, U>;
  variables: T;
  onSuccess: (U: U) => void;
  onFailure: (error: ApolloError) => void;
}) => [() => Promise<void>, AsyncOperation];

const useMutation: UseMutation = <T, U>({
  gqlPipe,
  variables,
  onSuccess,
  onFailure,
}) => {
  const [asyncOperation, setAsyncOperation] = useState<AsyncOperation>('idle');
  const mutate = useCallback(async () => {
    if (asyncOperation !== 'in-progress') {
      apolloCache.client
        .mutate(gqlPipe(variables))
        .then(onSuccess)
        .catch(onFailure)
        .finally(() => {
          setAsyncOperation('idle');
        });
      setAsyncOperation('in-progress');
    }
  }, [variables, onSuccess, onFailure, gqlPipe]);
  return [mutate, asyncOperation];
};

export { useMutation };

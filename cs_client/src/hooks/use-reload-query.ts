import { useRef } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';

const useReloadQuery = (
  { reloadRequestIDs }: { reloadRequestIDs: (string | number)[] },
  { query, queryVariables },
) => {
  const reloadQueuesRef = useRef({});
  const [fetch, { data, loading, error }] = useLazyQuery(query, {
    variables: queryVariables,
    fetchPolicy: 'network-only',
  });
  const firstFetchRef = useRef(true);
  if (firstFetchRef.current) {
    firstFetchRef.current = false;
    fetch();
  }
  const doReload = reloadRequestIDs.some(
    reloadRequestID => !reloadQueuesRef.current[reloadRequestID],
  );
  if (doReload) {
    reloadRequestIDs.forEach(
      reloadRequestID => (reloadQueuesRef.current[reloadRequestID] = true),
    );
    fetch();
  }
  return { data, error, loading, manualFetch: fetch };
};

export { useReloadQuery };

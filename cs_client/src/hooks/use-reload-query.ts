import { useRef } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';

const useReloadQuery = ({ reloadRequestID }, { query, queryVariables }) => {
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
  if (reloadRequestID && !reloadQueuesRef.current[reloadRequestID]) {
    reloadQueuesRef.current[reloadRequestID] = true;
    fetch();
  }
  return { data, error, loading };
};

export { useReloadQuery };

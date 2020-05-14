import { useRef } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import { useIsNotProcessed } from '::hooks/misc/isnot-processed';

const useFirstFetch = fetch => {
  const firstFetchRef = useRef(true);
  if (firstFetchRef.current) {
    firstFetchRef.current = false;
    fetch();
  }
};

const useReloadQuery = (
  { reloadRequestIDs }: { reloadRequestIDs: (string | number)[] },
  { query, queryVariables },
) => {
  const isNotProcessed = useIsNotProcessed(reloadRequestIDs);
  const fetchPolicy = useRef(undefined);
  if (isNotProcessed) {
    fetchPolicy.current = 'network-only';
  }

  const [fetch, { data, loading, error }] = useLazyQuery(query, {
    variables: queryVariables,
    fetchPolicy: fetchPolicy.current,
    onCompleted: () => {
      fetchPolicy.current = undefined;
    },
  });
  useFirstFetch(fetch);
  if (isNotProcessed) {
    fetch();
  }
  return { data, error, loading };
};

export { useReloadQuery };

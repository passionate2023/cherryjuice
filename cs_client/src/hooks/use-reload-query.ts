import { useRef } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import { createIsNotProcessed } from '::hooks/misc/isnot-processed';

const useFirstFetch = fetch => {
  const firstFetchRef = useRef(true);
  if (firstFetchRef.current) {
    firstFetchRef.current = false;
    fetch();
  }
};
const useReloadQuery = (
  {
    reloadRequestIDs,
  }: {
    beforeReset?: Function;
    reloadRequestIDs: (string | number)[];
    reset?: boolean;
  },
  { query, queryVariables },
) => {
  const fn = useRef(createIsNotProcessed());
  const isNotProcessed = fn.current(...reloadRequestIDs);
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

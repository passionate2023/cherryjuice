import { apolloClient } from '::graphql/client/apollo-client';
import { QUERY_DOCUMENTS } from '::graphql/queries';
import { useEffect, useRef } from 'react';
import { ac } from '::store/store';
import { DocumentOperation } from '@cherryjuice/graphql-types';

const useGetPreviousOperations = (userId: string) => {
  const alreadyRun = useRef(false);
  useEffect(() => {
    if (alreadyRun.current || !userId) return;
    apolloClient
      .query({
        ...QUERY_DOCUMENTS.currentImports,
        variables: { userId },
        fetchPolicy: 'no-cache',
      })
      .then(data => {
        alreadyRun.current = true;
        const previousOperations: DocumentOperation[] = data
          .filter(({ status }) => status)
          .map(({ status }) => JSON.parse(status));

        if (previousOperations.length)
          ac.documentOperations.add(...previousOperations);
      });
  }, [userId]);
};

export { useGetPreviousOperations };

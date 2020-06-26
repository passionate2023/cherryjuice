import { apolloCache } from '::graphql/cache/apollo-cache';
import { QUERY_DOCUMENTS } from '::graphql/queries';
import { useEffect } from 'react';

const useGetPreviousOperations = ({ activeImports, setActiveImports }) => {
  useEffect(() => {
    apolloCache.client
      .query({
        ...QUERY_DOCUMENTS.currentImports,
        fetchPolicy: 'network-only',
      })
      .then(data => {
        const activeOperations = data
          .filter(({ status }) => status)
          .map(({ id, status, name }) => [
            id,
            {
              documentId: id,
              documentName: name,
              eventType: status,
            },
          ]);
        if (activeOperations.length)
          setActiveImports({
            ...Object.fromEntries(activeOperations),
            ...activeImports,
          });
      });
  }, []);
};

export { useGetPreviousOperations };

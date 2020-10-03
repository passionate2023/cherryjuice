import { apolloClient } from '::graphql/client/apollo-client';
import { QUERY_DOCUMENTS } from '::graphql/queries';
import { useEffect } from 'react';
import { ac } from '::store/store';
import { DocumentOperation } from '::types/graphql';

const useGetPreviousOperations = () => {
  useEffect(() => {
    apolloClient
      .query({
        ...QUERY_DOCUMENTS.currentImports,
        variables: undefined,
        fetchPolicy: 'no-cache',
      })
      .then(data => {
        const previousOperations: DocumentOperation[] = data
          .filter(({ status }) => status)
          .map(({ status }) => JSON.parse(status));

        if (previousOperations.length)
          ac.documentOperations.add(previousOperations);
      });
  }, []);
};

export { useGetPreviousOperations };

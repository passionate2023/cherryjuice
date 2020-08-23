import { apolloClient } from '::graphql/client/apollo-client';
import { QUERY_DOCUMENTS } from '::graphql/queries';
import { useEffect } from 'react';
import { getOperationCategory } from './get-active-operations';
import { ac } from '::store/store';

const useGetPreviousOperations = () => {
  useEffect(() => {
    apolloClient
      .query({
        ...QUERY_DOCUMENTS.currentImports,
        variables: undefined,
        fetchPolicy: 'network-only',
      })
      .then(data => {
        const { exports, imports } = data
          .filter(({ status }) => status)
          .reduce(
            (acc, document) => {
              const category = getOperationCategory(document);
              acc[category].push(document);
              return acc;
            },
            {
              imports: [],
              exports: [],
            },
          );
        if (imports.length) ac.documentOperations.addImports(imports);
        if (exports.length) ac.documentOperations.addExports(exports);
      });
  }, []);
};

export { useGetPreviousOperations };

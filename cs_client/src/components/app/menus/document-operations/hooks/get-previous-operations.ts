import { apolloCache } from '::graphql/cache/apollo-cache';
import { QUERY_DOCUMENTS } from '::graphql/queries';
import { useEffect } from 'react';
import { getOperationCategory } from './get-active-operations';
import { ac } from '::root/store/store';

const useGetPreviousOperations = () => {
  useEffect(() => {
    apolloCache.client
      .query({
        ...QUERY_DOCUMENTS.currentImports,
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

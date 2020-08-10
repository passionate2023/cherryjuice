import { useReloadQuery } from '::hooks/use-reload-query';
import { QUERY_DOCUMENTS } from '::graphql/queries';
import { useQueryTimeout } from '::hooks/use-query-timeout';
import { apolloCache } from '::graphql/cache/apollo-cache';
import { useMemo } from 'react';

const useGetDocumentsList = ({ reloadFiles }: { reloadFiles: number }) => {
  const { data, loading, error } = useReloadQuery(
    {
      reloadRequestIDs: [reloadFiles],
    },
    {
      query: QUERY_DOCUMENTS.documentMeta.query,
      queryVariables: undefined,
    },
  );
  useQueryTimeout(
    {
      queryData: data,
      queryError: error,
      queryVariables: reloadFiles,
    },
    { resourceName: 'files' },
  );
  const documentsList = useMemo(() => {
    const documentsList = [...QUERY_DOCUMENTS.documentMeta.path(data)];
    for (const docId of apolloCache.changes.document().created) {
      const document = apolloCache.document.get(docId);
      documentsList.push({ ...document, name: `*${document.name}` });
    }
    for (const docId of apolloCache.changes.document().unsaved) {
      const editedMeta = apolloCache.changes.document(docId).meta;
      const document = documentsList.find(document => document.id === docId);
      if (document) {
        Array.from(editedMeta).forEach(([k, v]) => {
          document[k] = v;
        });
      }
    }
    return documentsList;
  }, [data]);
  return { documentsList, loading };
};

export { useGetDocumentsList };

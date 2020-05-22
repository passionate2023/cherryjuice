import { useReloadQuery } from '::hooks/use-reload-query';
import { QUERY_NODE_META } from '::graphql/queries';
import { useQueryTimeout } from '::hooks/use-query-timeout';
import { useEffect, useMemo } from 'react';
import { constructTree } from '::app/editor/document/hooks/get-document-meta/helpers/construct-tree';
import { handleErrors } from '::app/editor/document/hooks/get-document-meta/helpers/handle-errors';
import { setHighestNodeId } from '::app/editor/document/hooks/get-document-meta/helpers/set-highset-node_id';
import { clearLocalChanges } from '::app/editor/document/hooks/get-document-meta/helpers/clear-local-changes';

type Props = {
  file_id: string;
  selectedFile: string;
  reloadRequestID: number;
  cacheTimeStamp: number;
  savingInProgress: boolean;
};

const useGetDocumentMeta = ({
  file_id,
  selectedFile,
  reloadRequestID,
  cacheTimeStamp,
  savingInProgress,
}: Props) => {
  const queryVariables = { file_id };
  let { data, error, loading } = useReloadQuery(
    {
      reloadRequestIDs: [reloadRequestID],
      reset: true,
      beforeReset: () => {
        clearLocalChanges();
      },
    },
    {
      query: QUERY_NODE_META.query,
      queryVariables,
    },
  );
  useQueryTimeout(
    {
      queryData: data,
      queryError: error,
      queryVariables,
    },
    { resourceName: 'the document' },
  );

  const nodes = useMemo(() => {
    return savingInProgress ? nodes : constructTree({ data, file_id });
  }, [data, cacheTimeStamp, file_id, savingInProgress]);

  useEffect(() => {
    if (nodes) setHighestNodeId(nodes);
  }, [nodes]);

  useEffect(() => {
    if (!file_id.startsWith('new-document'))
      handleErrors({ file_id, selectedFile, error });
  }, [error, file_id]);
  return { nodes: !loading && nodes, loading };
};

export { useGetDocumentMeta };

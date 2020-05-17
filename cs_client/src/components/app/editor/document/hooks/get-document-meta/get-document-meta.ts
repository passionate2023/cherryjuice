import { useReloadQuery } from '::hooks/use-reload-query';
import { QUERY_NODE_META } from '::graphql/queries';
import { useQueryTimeout } from '::hooks/use-query-timeout';
import { useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { TEditedNodes } from '::app/editor/document/reducer/initial-state';
import { constructTree } from '::app/editor/document/hooks/get-document-meta/helpers/construct-tree';
import { handleErrors } from '::app/editor/document/hooks/get-document-meta/helpers/handle-errors';
import { setHighestNodeId } from '::app/editor/document/hooks/get-document-meta/helpers/set-highset-node_id';
import { clearLocalChanges } from '::app/editor/document/hooks/get-document-meta/helpers/clear-local-changes';

type Props = {
  file_id: string;
  selectedFile: string;
  reloadRequestID: number;
  localChanges: TEditedNodes;
};
const useGetDocumentMeta = ({
  file_id,
  selectedFile,
  localChanges,
  reloadRequestID,
}: Props) => {
  const history = useHistory();
  const queryVariables = { file_id: file_id || '' };
  const { data, error, loading } = useReloadQuery(
    {
      reloadRequestIDs: [reloadRequestID],
      reset: true,
      beforeReset: () => {
        // history.push(`/document/${file_id}`);
        clearLocalChanges(localChanges);
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

  const nodes = useMemo(() => constructTree({ data, localChanges }), [
    data,
    localChanges,
  ]);

  useEffect(() => {
    if (nodes) setHighestNodeId(nodes);
  }, [nodes]);

  useEffect(() => {
    handleErrors({ history, file_id, selectedFile, error });
  }, [error, file_id]);
  return { nodes: !loading && nodes, loading };
};

export { useGetDocumentMeta };

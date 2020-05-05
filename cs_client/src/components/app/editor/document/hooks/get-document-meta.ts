import { useReloadQuery } from '::hooks/use-reload-query';
import { QUERY_NODE_META } from '::graphql/queries';
import { useQueryTimeout } from '::hooks/use-query-timeout';
import { NodeMeta } from '::types/generated';
import { useEffect, useMemo } from 'react';
import { appActionCreators } from '::app/reducer';
import { useHistory } from 'react-router-dom';

const useGetDocumentMeta = (
  file_id: string,
  selectedFile: string,
  reloadRequestID: number,
) => {
  const history = useHistory();
  const queryVariables = { file_id: file_id || '' };
  const { data, error, loading } = useReloadQuery(
    {
      reloadRequestIDs: [reloadRequestID],
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
  const nodes: Map<number, NodeMeta> = useMemo(() => {
    const nodes = QUERY_NODE_META.path(data);
    if (nodes) {
      return new Map(nodes.map(node => [node.node_id, node]));
    }
  }, [loading, file_id]);
  useEffect(() => {
    if (error) {
      if (file_id && file_id === selectedFile) {
        appActionCreators.selectFile(undefined);
        history.push('/');
      } else {
        history.push('/' + selectedFile);
      }
    } else {
      if (selectedFile && !file_id) history.push('/' + selectedFile);
      else if (
        file_id !== selectedFile &&
        !/(login.*|signup.*)/.test(file_id)
      ) {
        appActionCreators.selectFile(file_id);
      }
    }
  }, [error, file_id]);
  return { nodes, loading };
};

export { useGetDocumentMeta };

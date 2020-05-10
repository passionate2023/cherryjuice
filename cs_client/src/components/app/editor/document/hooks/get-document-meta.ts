import { useReloadQuery } from '::hooks/use-reload-query';
import { QUERY_NODE_META } from '::graphql/queries';
import { useQueryTimeout } from '::hooks/use-query-timeout';
import { NodeMeta } from '::types/graphql/adapters';
import { useContext, useEffect, useMemo } from 'react';
import { appActionCreators } from '::app/reducer';
import { useHistory } from 'react-router-dom';
import { TEditedNodes } from '::app/editor/document/reducer/initial-state';
import { RootContext } from '::root/root-context';

const useGetDocumentMeta = (
  file_id: string,
  selectedFile: string,
  reloadRequestID: number,
  localChanges: TEditedNodes,
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
  const {
    apolloClient: { cache },
  } = useContext(RootContext);

  const nodes: Map<number, NodeMeta> = useMemo(() => {
    let nodes,
      nodesArray = QUERY_NODE_META.path(data);
    if (nodesArray) {
      nodes = new Map(nodesArray.map(node => [node.node_id, node]));
      Object.entries(localChanges).forEach(([nodeId, { edited }]) => {
        if (edited?.meta) {
          // @ts-ignore
          const node = cache.data.get('Node:' + nodeId);
          nodes.set(node.node_id, node);
        }
      });
    }
    return nodes;
  }, [loading, file_id, localChanges]);

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

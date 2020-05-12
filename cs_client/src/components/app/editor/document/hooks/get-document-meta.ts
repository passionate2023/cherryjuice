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
  const nodes = useMemo(() => {
    let nodes: Map<number, NodeMeta>;
    const nodesArray = QUERY_NODE_META.path(data) || [];
    if (nodesArray.length) {
      nodes = new Map(nodesArray.map(node => [node.node_id, node]));
      Object.entries(localChanges).forEach(
        ([nodeId, { edited, new: isNew }]) => {
          if (edited?.meta) {
            // @ts-ignore
            const node = cache.data.get('Node:' + nodeId);
            nodes.set(node.node_id, {
              ...node,
              child_nodes: Array.isArray(node.child_nodes)
                ? node.child_nodes
                : node.child_nodes.json,
            });
          }
          if (isNew) {
            // @ts-ignore
            const node = cache.data.get('Node:' + nodeId);
            const fatherNode = nodes.get(node.father_id);
            if (!fatherNode.child_nodes.includes(node.node_id)) {
              const position =
                node.previous_sibling_node_id === -1
                  ? Infinity
                  : fatherNode.child_nodes.indexOf(
                      node.previous_sibling_node_id,
                    ) + 1;
              fatherNode.child_nodes.splice(position, 0, node.node_id);
              delete node.previous_sibling_node_id;
              // @ts-ignore
              cache.data.set('Node:' + nodeId, { ...node, position });
            }
            nodes.set(node.node_id, {
              ...node,
              child_nodes: Array.isArray(node.child_nodes)
                ? node.child_nodes
                : node.child_nodes.json,
            });
          }
        },
      );
    }
    return nodes;
  }, [loading, file_id, localChanges]);

  useEffect(() => {
    if (nodes) {
      const SET_HIGHEST_NODE_ID = Array.from(nodes.keys())
        .sort((a, b) => a - b)
        .pop();

      appActionCreators.setHighestNodeId(SET_HIGHEST_NODE_ID);
    }
  }, [nodes]);

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

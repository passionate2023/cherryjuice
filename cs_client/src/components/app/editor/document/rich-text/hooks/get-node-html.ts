import { QUERY_NODE_CONTENT } from '::graphql/queries';
import { useReloadQuery } from '::hooks/use-reload-query';
import { useQueryTimeout } from '::hooks/use-query-timeout';
import { ApolloError } from 'apollo-client';
import { useContext } from 'react';
import { DocumentContext } from '::app/editor/document/reducer/context';
import { RootContext } from '::root/root-context';

const useGetNodeHtml = ({
  node_id,
  reloadRequestIDs,
  file_id,
  nodeId,
}): {
  html: { node_id: number; htmlRaw: string };
  processLinks: number;
  error: ApolloError;
} => {
  let processLinks;
  const queryVariables = {
    file_id,
    node_id,
  };
  let { data, error } = useReloadQuery(
    {
      reloadRequestIDs,
    },
    {
      query: QUERY_NODE_CONTENT.html.query,
      queryVariables,
    },
  );
  const html = { node_id, htmlRaw: '' };
  const { nodes } = useContext(DocumentContext);
  const {
    apolloClient: { cache },
  } = useContext(RootContext);
  const isNewNode = nodeId && nodes[nodeId]?.new;
  if (isNewNode) {
    // @ts-ignore
    const node = cache.data.get('Node:' + nodeId);
    data = {
      document: [{ node: [{ html: node.html, node_id: node.node_id }] }],
    };
  }
  useQueryTimeout(
    {
      queryData: data,
      queryError: error,
      queryVariables,
    },
    { resourceName: 'the node' },
  );
  const node = QUERY_NODE_CONTENT.html.path(data);
  if (node && node.node_id === node_id) {
    html.htmlRaw = node.html;
    processLinks = new Date().getTime();
  }

  return { html, processLinks, error };
};

export { useGetNodeHtml };

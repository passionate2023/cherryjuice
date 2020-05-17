import { QUERY_NODE_CONTENT } from '::graphql/queries';
import { useReloadQuery } from '::hooks/use-reload-query';
import { useQueryTimeout } from '::hooks/use-query-timeout';
import { ApolloError } from 'apollo-client';
import { apolloCache } from '::graphql/cache/apollo-cache';

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
  useQueryTimeout(
    {
      queryData: data,
      queryError: error,
      queryVariables,
    },
    { resourceName: 'the node' },
  );
  const html = { node_id, htmlRaw: '' };
  const isNewNode = apolloCache.changes.isNodeNew(nodeId);
  if (isNewNode) {
    const node = apolloCache.node.get(nodeId);
    if (node)
      data = {
        document: [{ node: [{ html: node.html, node_id: node.node_id }] }],
      };
  }
  const node = QUERY_NODE_CONTENT.html.path(data);
  if (node && node.node_id === node_id) {
    html.htmlRaw = node.html;
    processLinks = new Date().getTime();
  }

  return { html, processLinks, error };
};

export { useGetNodeHtml };

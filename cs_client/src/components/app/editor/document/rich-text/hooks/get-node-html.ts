import { QUERY_NODE_CONTENT } from '::graphql/queries';
import { useReloadQuery } from '::hooks/use-reload-query';
import { useQueryTimeout } from '::hooks/use-query-timeout';
import { ApolloError } from 'apollo-client';

const useGetNodeHtml = ({
  node_id,
  reloadRequestIDs,
  file_id,
}): {
  html: { node_id: number; htmlRaw: string; htmlWithImages: string };
  processLinks: number;
  error: ApolloError;
} => {
  let processLinks;
  const queryVariables = {
    file_id,
    node_id,
  };
  const { data, error } = useReloadQuery(
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
  let html = { node_id, htmlRaw: '', htmlWithImages: '' },
    node;
  node = QUERY_NODE_CONTENT.html.path(data);
  if (node && node.node_id === node_id) {
    html.htmlRaw = node.html;
    processLinks = new Date().getTime();
  }

  return { html, processLinks, error };
};

export { useGetNodeHtml };

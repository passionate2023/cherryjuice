import { QUERY_NODE_CONTENT } from '::graphql/queries';
import { usePng } from '::hooks/use-png';
import { useReloadQuery } from '::hooks/use-reload-query';
import { useQueryTimeout } from '::hooks/use-query-timeout';

const useGetNodeContent = (
  node_id,
  reloadDocument,
  file_id,
  processLinks,
  richTextRef,
) => {
  const queryVariables = {
    file_id,
    node_id: node_id,
    loadSqliteDocuments: true,
  };
  const { data, error } = useReloadQuery(
    {
      reloadRequestID: reloadDocument,
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
  let html, node;
  node = QUERY_NODE_CONTENT.html.path(data);
  if (node && node.node_id === node_id) {
    html = node.html;
    processLinks = new Date().getTime();
  }

  const all_png_base64 = usePng({
    file_id,
    node_id,
  });
  if (html && all_png_base64?.node_id === node_id && richTextRef.current) {
    let counter = 0;
    while (all_png_base64.pngs[counter] && /<img src=""/.test(html)) {
      html = html.replace(
        /<img src=""/,
        `<img src="data:image/png;base64,${all_png_base64.pngs[counter++]}"`,
      );
    }
    processLinks = new Date().getTime();
  }
  return { html, processLinks, error };
};

export { useGetNodeContent };

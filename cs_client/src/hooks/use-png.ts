import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import { QUERY_CT_NODE_CONTENT } from '::graphql/queries';
import { useEffect, useRef } from 'react';

const usePng = ({ node_id, offset, file_id }) => {
  const thumbnail = offset
    ? 'png_thumbnail_base64'
    : 'all_png_thumbnail_base64';
  const full = offset ? 'png_full_base64' : 'all_png_full_base64';

  const png = useRef(undefined);
  const startFetchingFull = useRef(false);
  const { data: data_thumbnail } = useQuery(QUERY_CT_NODE_CONTENT[thumbnail], {
    variables: { node_id, offset, file_id }
  });
  const [fetch, { data: data_full }] = useLazyQuery(
    QUERY_CT_NODE_CONTENT[full],
    {
      variables: { node_id, offset, file_id }
    }

  );
  // apollo caches previous fetch from unmounted instances of the component
  if (data_full?.ct_node_content[0]?.node_id === node_id) {
    png.current = {
      node_id,
      pngs: data_full.ct_node_content[0][full],
      full: true
    };
    return png.current;
  } else {
    if (data_thumbnail?.ct_node_content[0]?.node_id === node_id) {
      png.current = {
        node_id,
        pngs: data_thumbnail.ct_node_content[0][thumbnail],
        full: false
      };
    }
    // fetch the full res when the browser scrolls to the image
    if (png.current && !startFetchingFull.current) {
      fetch();
      startFetchingFull.current = true;
    }

    return png.current;
  }
};

export { usePng };

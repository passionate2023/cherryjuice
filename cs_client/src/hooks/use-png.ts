import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import { QUERY_CT_NODE_CONTENT } from '::graphql/queries';
import { useRef } from 'react';

const usePng = ({ node_id, offset, file_id }) => {
  const thumbnail = offset
    ? 'png_thumbnail'
    : 'all_png_thumbnail';
  const full = offset ? 'png' : 'all_png';

  const png = useRef(undefined);
  const startFetchingFull = useRef(false);
  const { data: data_thumbnail } = useQuery(QUERY_CT_NODE_CONTENT[thumbnail], {
    variables: { node_id, offset, file_id },
  });
  const [fetch, { data: data_full }] = useLazyQuery(
    QUERY_CT_NODE_CONTENT[full],
    {
      variables: { node_id, offset, file_id },
    },
  );
  // apollo caches previous fetch from unmounted instances of the component
  if (data_full?.document[0]?.node_content[0]?.node_id === node_id) {
    png.current = {
      node_id,
      pngs: data_full.document[0].node_content[0].png,
      full: true,
    };
    return png.current;
  } else {
    if (
      data_thumbnail?.document[0]?.node_content[0]?.node_id ===
      node_id
    ) {
      png.current = {
        node_id,
        pngs: data_thumbnail.document[0].node_content[0].png_thumbnail,
        full: false,
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

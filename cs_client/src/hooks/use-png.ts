import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import { QUERY_NODE_CONTENT } from '::graphql/queries';
import { useRef } from 'react';

const usePng = ({ node_id, file_id }) => {
  const png = useRef(undefined);
  const startFetchingFull = useRef(false);

  const { data: data_thumbnail } = useQuery(QUERY_NODE_CONTENT.png.query, {
    variables: { node_id, file_id, thumbnail: true },
  });
  const [fetch, { data: data_full }] = useLazyQuery(
    QUERY_NODE_CONTENT.png.query,
    {
      variables: { node_id, file_id, thumbnail: false },
    },
  );
  // apollo caches previous fetch from unmounted instances of the component
  const pngs_full = QUERY_NODE_CONTENT.png.path(data_full);
  if (pngs_full?.node_id === node_id) {
    png.current = {
      node_id,
      pngs: pngs_full.image,
      full: true,
    };
    return png.current;
  } else {
    const pngs_thumbnail = QUERY_NODE_CONTENT.png.path(data_thumbnail);
    if (pngs_thumbnail?.node_id === node_id) {
      png.current = {
        node_id,
        pngs: pngs_thumbnail.image,
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

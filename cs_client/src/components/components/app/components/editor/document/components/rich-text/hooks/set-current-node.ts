import { useEffect } from 'react';
import { ac } from '::store/store';

const useSetCurrentNode = (node_id, nodes, documentId) => {
  useEffect(() => {
    const node = nodes[node_id];
    if (node && node_id) {
      ac.document.selectNode({ documentId, node_id });
    }
  }, [node_id, nodes]);
};

export { useSetCurrentNode };

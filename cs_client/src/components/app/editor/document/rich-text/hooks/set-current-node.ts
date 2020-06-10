import { useEffect } from 'react';
import { ac } from '::root/store/actions.types';

const useSetCurrentNode = (node_id, nodes) => {
  useEffect(() => {
    const node = nodes?.get(node_id);
    if (node) {
      const { id } = node;
      ac.node.setSelected({ id, node_id });
    }
  }, [node_id, nodes]);
};

export { useSetCurrentNode };

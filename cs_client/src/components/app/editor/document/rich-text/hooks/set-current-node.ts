import { useEffect } from 'react';
import { appActionCreators } from '::app/reducer';

const useSetCurrentNode = (node_id, nodes) => {
  useEffect(() => {
    const node = nodes?.get(node_id);
    if (node) {
      const {
        name,
        node_title_styles,
        is_richtxt,
        createdAt,
        updatedAt,
        id,
        icon_id,
      } = node;
      appActionCreators.selectNode({
        nodeId: id,
        id: node_id,
        name,
        style: JSON.parse(node_title_styles),
        icon_id,
        is_richtxt,
        createdAt: String(createdAt),
        updatedAt: String(updatedAt),
      });
    }
  }, [node_id, nodes]);
};

export { useSetCurrentNode };

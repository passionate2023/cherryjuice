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
      } = node;
      appActionCreators.selectNode(
        {
          node_id,
          name,
          style: node_title_styles,
        },
        {
          is_richtxt,
          createdAt,
          updatedAt,
        },
      );
    }
  }, [node_id, nodes]);
};

export { useSetCurrentNode };

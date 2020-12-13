import { useCallback, useState } from 'react';
import { saveNodeContent } from '@cherryjuice/editor';
import { ac } from '::store/store';
import { modNode } from '::sass-modules';

type SelectNodeProps = {
  node_id: number;
  documentId: string;
};
const useSelectNode = ({ node_id, documentId }: SelectNodeProps) => {
  const [clickTimestamp, setTimestamp] = useState(0);
  const selectNode = useCallback(
    e => {
      const eventIsTriggeredByCollapseButton = e.target.parentElement.classList.contains(
        modNode.node__toggleChildren,
      );
      if (eventIsTriggeredByCollapseButton) return;
      setTimestamp(Date.now());

      saveNodeContent();
      ac.node.select({ documentId, node_id });
    },
    [documentId, node_id],
  );
  return { clickTimestamp, selectNode };
};

export { useSelectNode };
export { SelectNodeProps };

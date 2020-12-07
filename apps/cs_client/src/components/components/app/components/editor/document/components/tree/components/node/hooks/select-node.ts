import { useCallback } from 'react';
import { saveNodeContent } from '::editor/components/content-editable/helpers/save-node-content';
import { ac } from '::store/store';
import { modNode } from '::sass-modules';

type SelectNodeProps = {
  node_id: number;
  documentId: string;
};
const useSelectNode = ({ node_id, documentId }: SelectNodeProps) => {
  const selectNode = useCallback(
    e => {
      const eventIsTriggeredByCollapseButton = e.target.parentElement.classList.contains(
        modNode.node__toggleChildren,
      );
      if (eventIsTriggeredByCollapseButton) return;

      saveNodeContent();
      ac.node.select({ documentId, node_id });
    },
    [documentId, node_id],
  );
  return { selectNode };
};

export { useSelectNode };
export { SelectNodeProps };

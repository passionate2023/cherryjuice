import { useCallback, useState } from 'react';
import nodeMod from '::sass-modules/tree/node.scss';
import { updateCachedHtmlAndImages } from '::root/components/app/components/editor/document/components/tree/components/node/helpers/apollo-cache';
import { ac } from '::store/store';

type SelectNodeProps = {
  node_id: number;
  documentId: string;
};
const useSelectNode = ({ node_id, documentId }: SelectNodeProps) => {
  const [clickTimestamp, setTimestamp] = useState(0);
  const selectNode = useCallback(
    e => {
      const eventIsTriggeredByCollapseButton = e.target.parentElement.classList.contains(
        nodeMod.node__toggleChildren,
      );
      if (eventIsTriggeredByCollapseButton) return;
      setTimestamp(Date.now());

      updateCachedHtmlAndImages();
      ac.node.select({ documentId, node_id });
    },
    [documentId, node_id],
  );
  return { clickTimestamp, selectNode };
};

export { useSelectNode };
export { SelectNodeProps };

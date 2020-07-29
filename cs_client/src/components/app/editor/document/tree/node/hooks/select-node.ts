import { MutableRefObject, useCallback, useState } from 'react';
import nodeMod from '::sass-modules/tree/node.scss';
import { nodeOverlay } from '::app/editor/document/tree/node/helpers/node-overlay';
import { updateCachedHtmlAndImages } from '::app/editor/document/tree/node/helpers/apollo-cache';
import { router } from '::root/router/router';

type SelectNodeProps = {
  componentRef: MutableRefObject<HTMLDivElement>;
  node_id?: number;
  file_id?: string;
};
const useSelectNode = ({ componentRef, node_id, file_id }: SelectNodeProps) => {
  const [clickTimestamp, setTimestamp] = useState(0);
  const selectNode = useCallback(
    e => {
      const eventIsTriggeredByCollapseButton = e.target.classList.contains(
        nodeMod.node__titleButton,
      );
      if (eventIsTriggeredByCollapseButton) return;
      setTimestamp(Date.now());
      nodeOverlay.updateWidth();
      nodeOverlay.updateLeft(componentRef);
      updateCachedHtmlAndImages();
      router.goto.node(file_id, node_id);
    },
    [file_id, node_id, componentRef],
  );
  return { clickTimestamp, selectNode };
};

export { useSelectNode };
export { SelectNodeProps };

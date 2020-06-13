import { MutableRefObject, useCallback } from 'react';
import nodeMod from '::sass-modules/tree/node.scss';
import { nodeOverlay } from '::app/editor/document/tree/node/helpers/node-overlay';
import { updateCachedHtmlAndImages } from '::app/editor/document/tree/node/helpers/apollo-cache';
import { router } from '::root/router/router';

type SelectNodeProps = {
  nodePath: string;
  componentRef: MutableRefObject<HTMLDivElement>;
  node_id?: number;
  file_id?: string;
};
const useSelectNode = ({
  nodePath,
  componentRef,
  node_id,
  file_id,
}: SelectNodeProps) => {
  return useCallback(
    e => {
      const eventIsTriggeredByCollapseButton = e.target.classList.contains(
        nodeMod.node__titleButton,
      );
      if (eventIsTriggeredByCollapseButton) return;
      nodeOverlay.updateWidth();
      nodeOverlay.updateLeft(componentRef);
      updateCachedHtmlAndImages();
      router.node(file_id, node_id);
    },
    [nodePath],
  );
};

export { useSelectNode };
export { SelectNodeProps };

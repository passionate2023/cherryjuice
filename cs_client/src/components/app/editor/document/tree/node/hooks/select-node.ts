import { MutableRefObject, useCallback } from 'react';
import nodeMod from '::sass-modules/tree/node.scss';
import { nodeOverlay } from '::app/editor/document/tree/node/helpers/node-overlay';
import { updateCachedHtmlAndImages } from '::app/editor/document/tree/node/helpers/apollo-cache';
import { useHistory } from 'react-router-dom';

type SelectNodeProps = {
  nodePath: string;
  componentRef: MutableRefObject<HTMLDivElement>;
};
const useSelectNode = ({ nodePath, componentRef }: SelectNodeProps) => {
  const history = useHistory();
  return useCallback(
    (e, path = nodePath) => {
      const eventIsTriggeredByCollapseButton = e.target.classList.contains(
        nodeMod.node__titleButton,
      );
      if (eventIsTriggeredByCollapseButton) return;
      nodeOverlay.updateWidth();
      nodeOverlay.updateLeft(componentRef);

      updateCachedHtmlAndImages();
      history.push(path);
    },
    [nodePath],
  );
};

export { useSelectNode };
export {SelectNodeProps}

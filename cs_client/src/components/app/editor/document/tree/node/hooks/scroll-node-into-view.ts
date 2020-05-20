import { useEffect } from 'react';
import { nodeOverlay } from '::app/editor/document/tree/node/helpers/node-overlay';
import { scrollIntoToolbar } from '::helpers/ui';
import { SelectNodeProps } from '::app/editor/document/tree/node/hooks/select-node';

const useScrollNodeIntoView = ({ componentRef, nodePath }: SelectNodeProps) => {
  useEffect(() => {
    if (location.pathname === nodePath) {
      nodeOverlay.updateLeft(componentRef);
      // @ts-ignore
      componentRef?.current?.scrollIntoView();
      // --
      scrollIntoToolbar();
      // --
    }
  }, [nodePath]);
};

export {useScrollNodeIntoView}

import { useEffect } from 'react';
import { nodeOverlay } from '::root/components/app/components/editor/document/components/tree/components/node/helpers/node-overlay';
import { scrollIntoToolbar } from '::helpers/ui';
import { SelectNodeProps } from '::root/components/app/components/editor/document/components/tree/components/node/hooks/select-node';

const useScrollNodeIntoView = ({
  componentRef,
  nodePath,
}: SelectNodeProps & { nodePath: string }) => {
  useEffect(() => {
    if (location.pathname === nodePath) {
      nodeOverlay.updateLeft(componentRef);
      // @ts-ignore
      componentRef?.current?.scrollIntoView();
      // --
      scrollIntoToolbar();
      // --
    }
  }, [nodePath, componentRef]);
};

export { useScrollNodeIntoView };

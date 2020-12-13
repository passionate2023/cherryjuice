import * as React from 'react';
import { Icon, Icons } from '::root/components/shared-components/icon/icon';
import { memo, useCallback } from 'react';
import { ac } from '::store/store';
import { modNode } from '::sass-modules';

type Props = {
  depth: number;
  child_nodes: number[];
  showChildren: boolean;
  node_id: number;
  documentId: string;
};

const ToggleChildren: React.FC<Props> = memo(function ToggleChildren({
  depth,
  child_nodes,
  showChildren,
  node_id,
  documentId,
}) {
  const toggleChildren = useCallback(() => {
    if (showChildren) ac.documentCache.collapseNode({ documentId, node_id });
    else ac.documentCache.expandNode({ documentId, node_id });
  }, [showChildren]);
  return (
    <>
      <div style={{ marginLeft: depth * 20 }} />
      <div
        className={`${modNode.node__toggleChildren} ${
          child_nodes.length > 0 ? '' : modNode.node__titleButtonHidden
        }`}
      >
        {
          <Icon
            name={showChildren ? Icons.material.remove : Icons.material.add}
            size={10}
            onClick={toggleChildren}
          />
        }
      </div>
    </>
  );
});

export { ToggleChildren };

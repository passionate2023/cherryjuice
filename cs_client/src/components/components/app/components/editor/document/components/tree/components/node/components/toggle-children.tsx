import * as React from 'react';
import nodeMod from '::sass-modules/tree/node.scss';
import { Icon, Icons } from '::root/components/shared-components/icon/icon';
import { EventHandler, memo } from 'react';

type Props = {
  depth: number;
  child_nodes: number[];
  showChildren: boolean;
  toggleChildren: EventHandler<any>;
};

const ToggleChildren: React.FC<Props> = memo(function ToggleChildren({
  depth,
  child_nodes,
  showChildren,
  toggleChildren,
}) {
  return (
    <>
      <div style={{ marginLeft: depth * 20 }} />
      <div
        className={`${nodeMod.node__titleButton} ${
          child_nodes.length > 0 ? '' : nodeMod.node__titleButtonHidden
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

import * as React from 'react';
import { Icon, Icons } from '::root/components/shared-components/icon/icon';

import { memo } from 'react';
import { modNode } from '::sass-modules';

export type NodeCherryProps = {
  icon_id: number;
  depth: number;
};

const NodeCherry: React.FC<NodeCherryProps> = memo(function NodeIcon({
  icon_id,
  depth,
}) {
  const name = icon_id
    ? Icons.cherrytree.custom_icons[icon_id]
    : Icons.cherrytree.cherries[depth >= 11 ? 11 : depth];
  return (
    <Icon
      name={name}
      size={14}
      className={modNode.node__titleCherry}
      testId={'cherry' + (icon_id || 0)}
    />
  );
});

export { NodeCherry };

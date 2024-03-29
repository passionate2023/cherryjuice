import * as React from 'react';
import { Icon, Icons } from '@cherryjuice/icons';

import { memo } from 'react';
import { modNode } from '::sass-modules';

export const getNodeIconId = (icon_id: number, depth: number) =>
  icon_id
    ? Icons.cherrytree.custom_icons[icon_id]
    : Icons.cherrytree.cherries[depth >= 11 ? 11 : depth];

export type NodeCherryProps = {
  icon_id: number;
  depth: number;
};

const NodeCherry: React.FC<NodeCherryProps> = memo(function NodeIcon({
  icon_id,
  depth,
}) {
  const name = getNodeIconId(icon_id, depth);
  return (
    <Icon
      name={name}
      size={14}
      className={modNode.node__titleCherry}
      testId={'cherry' + (icon_id || 0)}
      image={true}
    />
  );
});

export { NodeCherry };

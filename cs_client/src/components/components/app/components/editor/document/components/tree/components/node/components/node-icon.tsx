import * as React from 'react';
import { Icon, Icons } from '::root/components/shared-components/icon/icon';
import modIcons from '::sass-modules/tree/node.scss';
import { memo } from 'react';

type Props = {
  icon_id: number;
  depth: number;
};

const NodeIcon: React.FC<Props> = memo(function NodeIcon({ icon_id, depth }) {
  return (
    <Icon
      name={
        icon_id
          ? Icons.cherrytree.custom_icons[icon_id]
          : Icons.cherrytree.cherries[depth >= 11 ? 11 : depth]
      }
      size={14}
      className={modIcons.node__titleCherry}
      testId={'cherry' + (icon_id || 0)}
    />
  );
});

export { NodeIcon };

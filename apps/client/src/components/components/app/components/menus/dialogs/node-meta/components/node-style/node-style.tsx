import * as React from 'react';
import mod from './node-style.scss';
import { FontStyle } from '::app/components/menus/dialogs/node-meta/components/font-style/font-style';
import { ColorInput } from '@cherryjuice/components';
import {
  NodeMeta,
  nodeMetaActionCreators,
} from '::app/components/menus/dialogs/node-meta/reducer/reducer';
import { testIds } from '@cherryjuice/test-ids';
import { IconPicker } from '::app/components/menus/dialogs/node-meta/components/icon-picker';

type Props = Pick<
  NodeMeta,
  'isBold' | 'customColor' | 'nodeDepth' | 'customIcon'
>;

export const NodeStyle: React.FC<Props> = ({
  customIcon,
  nodeDepth,
  customColor,
  isBold,
}) => {
  return (
    <div className={mod.nodeStyle}>
      <FontStyle isBold={isBold} />
      <ColorInput
        onChange={nodeMetaActionCreators.setCustomColor}
        value={customColor}
        testId={testIds.nodeMeta__customColor}
      />
      <IconPicker
        onChange={nodeMetaActionCreators.setCustomIcon}
        value={customIcon}
        nodeDepth={nodeDepth}
      />
    </div>
  );
};

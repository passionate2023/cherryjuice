import * as React from 'react';
import { modNodePath, modTabs } from '::sass-modules';
import { ac } from '::store/store';
import { joinClassNames } from '@cherryjuice/shared-helpers';
import { Icons, Icon } from '@cherryjuice/icons';
import { NodeProps } from '::root/components/app/components/tabs/components/components/tab';

type Props = NodeProps & { documentId: string };

const Node: React.FC<Props> = ({
  hasChanges,
  isSelected,
  name,
  documentId,
  node_id,
  isNew,
}) => {
  return (
    <div
      className={joinClassNames([
        modNodePath.nodePath__node,
        [modNodePath.nodePath__nodeSelected, isSelected],
        [modTabs.tabHasChanges, hasChanges],
        [modTabs.tabIsNew, isNew],
      ])}
      onClick={() => ac.node.select({ documentId, node_id })}
      data-id={node_id}
    >
      <Icon name={Icons.material['arrow-right']} />
      <span>{name}</span>
    </div>
  );
};

export { Node };

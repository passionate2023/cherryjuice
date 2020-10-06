import * as React from 'react';
import {
  NodeVisibility,
  NodeVisibilityProps,
} from '::root/components/app/components/editor/document/components/tree/components/node/components/node-icons/components/visibility-icon';
import {
  NodeCherry,
  NodeCherryProps,
} from '::root/components/app/components/editor/document/components/tree/components/node/components/node-icons/components/node-cherry';
import { Icon, Icons } from '::root/components/shared-components/icon/icon';
import { modNode } from '::sass-modules';

type Props = NodeVisibilityProps & NodeCherryProps & { read_only: boolean };

const NodeIcons: React.FC<Props> = ({
  depth,
  icon_id,
  documentPrivacy,
  parentPrivacy,
  privacy,
  read_only,
}) => {
  return (
    <div className={modNode.node__icons}>
      <NodeCherry depth={depth} icon_id={icon_id} />
      <NodeVisibility
        documentPrivacy={documentPrivacy}
        parentPrivacy={parentPrivacy}
        privacy={privacy}
      />
      {read_only && (
        <div className={modNode.node__titlePrivacy}>
          <Icon name={Icons.material.key} size={14} loadAsInlineSVG={'force'} />
        </div>
      )}
    </div>
  );
};

export { NodeIcons };

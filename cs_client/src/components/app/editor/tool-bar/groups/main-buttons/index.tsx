import * as React from 'react';
import { appActionCreators } from '::app/reducer';
import { ToolbarButton } from '::app/editor/tool-bar/tool-bar-button';
import { Icon, Icons } from '::shared-components/icon';
import { modToolbar } from '::sass-modules/index';

type Props = {
  showTree: boolean;
  selectedNodeId;
};

const MainButtons: React.FC<Props> = ({ showTree, selectedNodeId }) => {
  return (
    <div className={modToolbar.toolBar__group}>
      <ToolbarButton onClick={appActionCreators.toggleTree} enabled={showTree}>
        <Icon
          name={Icons.cherrytree.additionalIcons.cherries}
          style={{ width: 22 }}
        />
      </ToolbarButton>
      <ToolbarButton
        onClick={appActionCreators.showNodeMetaEdit}
        disabled={!selectedNodeId}
      >
        <Icon name={Icons.material.edit} />
      </ToolbarButton>
      <ToolbarButton onClick={appActionCreators.showNodeMetaCreate}>
        <Icon name={Icons.material.document} />
      </ToolbarButton>
      <ToolbarButton onClick={appActionCreators.saveDocument}>
        <Icon name={Icons.material.save} />
      </ToolbarButton>
      <ToolbarButton onClick={appActionCreators.reloadDocument}>
        <Icon name={Icons.material.refresh} />
      </ToolbarButton>
    </div>
  );
};

export { MainButtons };

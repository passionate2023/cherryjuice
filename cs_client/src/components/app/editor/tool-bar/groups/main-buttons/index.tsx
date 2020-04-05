import * as React from 'react';
import { appActionCreators } from '::app/reducer';
import { ToolbarButton } from '::app/editor/tool-bar/tool-bar-button';
import { Icon, Icons } from '::shared-components/icon';
import { modToolbar } from '::sass-modules/index';

type Props = {};

const MainButtons: React.FC<Props> = () => {
  return (
    <div className={modToolbar.toolBar__group}>
      <ToolbarButton onClick={appActionCreators.toggleTree}>
        <Icon
          name={Icons.cherrytree.additionalIcons.cherries}
          style={{ width: 22 }}
        />
      </ToolbarButton>
      <ToolbarButton onClick={appActionCreators.toggleSettings}>
        <Icon name={Icons.material.settings} small={true} />
      </ToolbarButton>
      <ToolbarButton onClick={appActionCreators.toggleFileSelect}>
        <Icon name={Icons.material.folder} small={true} />
      </ToolbarButton>
      <ToolbarButton onClick={appActionCreators.saveDocument}>
        <Icon name={Icons.material.save} small={true} />
      </ToolbarButton>
      <ToolbarButton onClick={appActionCreators.reloadDocument}>
        <Icon name={Icons.material.refresh} small={true} />
      </ToolbarButton>
    </div>
  );
};

export { MainButtons };

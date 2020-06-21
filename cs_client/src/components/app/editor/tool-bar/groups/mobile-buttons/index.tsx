import * as React from 'react';
import { modToolbar } from '::sass-modules/index';
import { ToolbarButton } from '../../tool-bar-button';
import { Icon, Icons } from '::shared-components/icon/icon';
import { appActionCreators } from '::app/reducer';
import { Separator } from '::app/editor/tool-bar/separator';

type Props = {
  showFormattingButtons: boolean;
  contentEditable: boolean;
  showRecentNodes: boolean;
  showInfoBar: boolean;
};

const MobileButtons: React.FC<Props> = ({
  showFormattingButtons,
  showRecentNodes,
  showInfoBar,
}) => {
  return (
    <div
      className={[
        modToolbar.toolBar__group,
        modToolbar.toolBar__groupMobileButtons,
      ].join(' ')}
    >
      <ToolbarButton
        onClick={appActionCreators.toggleFormattingButtons}
        enabled={showFormattingButtons}
      >
        <Icon name={Icons.material['justify-left']} />
      </ToolbarButton>
      <Separator />
      <ToolbarButton
        onClick={appActionCreators.toggleRecentBar}
        enabled={showRecentNodes}
      >
        <Icon name={Icons.material.history} />
      </ToolbarButton>
      <ToolbarButton
        onClick={appActionCreators.toggleInfoBar}
        enabled={showInfoBar}
      >
        <Icon name={Icons.material.info} />
      </ToolbarButton>
    </div>
  );
};

export { MobileButtons };

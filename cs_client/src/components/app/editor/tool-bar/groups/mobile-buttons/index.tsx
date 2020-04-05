import * as React from 'react';
import { modToolbar } from '::sass-modules/index';
import { ToolbarButton } from '../../tool-bar-button';
import { Icon, Icons } from '::shared-components/icon';
import { appActionCreators } from '::app/reducer';
import { Separator } from '::app/editor/tool-bar/separator';

type Props = {
  contentEditable: boolean;
};

const MobileButtons: React.FC<Props> = ({ contentEditable }) => {
  return (
    <div
      className={[
        modToolbar.toolBar__group,
        modToolbar.toolBar__groupMobileButtons,
      ].join(' ')}
    >
      <ToolbarButton onClick={appActionCreators.toggleContentEditable}>
        <Icon
          name={
            contentEditable
              ? Icons.material['lock-open']
              : Icons.material['lock-closed']
          }
          small={true}
        />
      </ToolbarButton>
      <ToolbarButton onClick={appActionCreators.toggleFormattingButtons}>
        <Icon name={Icons.material['justify-left']} small={true} />
      </ToolbarButton>
      <Separator />
      <ToolbarButton onClick={appActionCreators.toggleRecentBar}>
        <Icon name={Icons.material.history} small={true} />
      </ToolbarButton>
      <ToolbarButton onClick={appActionCreators.toggleInfoBar}>
        <Icon name={Icons.material.info} small={true} />
      </ToolbarButton>
    </div>
  );
};

export { MobileButtons };

import * as React from 'react';
import { modToolbar } from '../../../../../assets/styles/modules';
import { ToolbarButton } from '../../tool-bar-button';
import { Icon, Icons } from '../../../../shared-components/icon';
import { appActionCreators } from '../../../reducer';
import { Separator } from '::app/tool-bar/separator';

type Props = {
  dispatch: (action: { type: string; value?: any }) => void;
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
            contentEditable ? Icons.material['lock-open'] : Icons.material['lock-closed']
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

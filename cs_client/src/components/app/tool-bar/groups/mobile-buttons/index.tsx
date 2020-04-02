import * as React from 'react';
import { modToolbar } from '../../../../../assets/styles/modules';
import { ToolbarButton } from '../../tool-bar-button';
import { Icon, Icons } from '../../../../shared-components/icon';
import { appActionCreators } from '../../../reducer';

type Props = {
  dispatch: (action: { type: string; value?: any }) => void;
};

const MobileButtons: React.FC<Props> = () => {
  return (
    <div
      className={[
        modToolbar.toolBar__group,
        modToolbar.toolBar__groupMobileButtons,
      ].join(' ')}
    >
      <ToolbarButton onClick={appActionCreators.toggleFormattingButtons}>
        <Icon name={Icons.material['justify-left']} small={true} />
      </ToolbarButton>
      <ToolbarButton onClick={appActionCreators.toggleContentEditable}>
        <Icon name={Icons.material.edit} small={true} />
      </ToolbarButton>
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

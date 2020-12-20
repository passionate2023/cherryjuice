import * as React from 'react';
import { ToolbarButton } from '::app/components/editor/tool-bar/components/tool-bar-button/tool-bar-button';
import { execK, FormattingHotProps } from '@cherryjuice/editor';
import { modToolbar } from '::sass-modules';
import { Icon } from '@cherryjuice/icons';

type Props = FormattingHotProps & { disabled: boolean };
export const FormattingButton: React.FC<Props> = hk => {
  return (
    <ToolbarButton
      key={hk.name}
      onClick={() => execK(hk['execCommandArguments'])}
      className={modToolbar.toolBar__iconStrictWidth}
      disabled={hk.disabled}
    >
      <Icon name={hk['icon']} />
    </ToolbarButton>
  );
};

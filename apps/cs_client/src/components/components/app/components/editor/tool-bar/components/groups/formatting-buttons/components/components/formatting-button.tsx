import * as React from 'react';
import { ToolbarButton } from '@cherryjuice/components';
import { execK, FormattingHotProps } from '@cherryjuice/editor';
import { modToolbar } from '::sass-modules';

type Props = FormattingHotProps & { disabled: boolean };
export const FormattingButton: React.FC<Props> = hk => {
  return (
    <ToolbarButton
      onClick={() => execK(hk['execCommandArguments'])}
      className={modToolbar.toolBar__iconStrictWidth}
      disabled={hk.disabled}
      icon={hk['icon']}
    />
  );
};

import * as React from 'react';
import { ToolbarButton } from '@cherryjuice/components';
import { execK, FormattingHotProps } from '@cherryjuice/editor';

type Props = FormattingHotProps & { disabled: boolean };
export const FormattingButton: React.FC<Props> = hk => {
  return (
    <ToolbarButton
      onClick={() => execK(hk['execCommandArguments'])}
      disabled={hk.disabled}
      icon={hk['icon']}
    />
  );
};

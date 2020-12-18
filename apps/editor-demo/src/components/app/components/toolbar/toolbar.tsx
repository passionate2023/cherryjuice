import * as React from 'react';
import { modToolbar } from '::sass-modules';
import { FormattingButtons } from '::root/app/components/toolbar/components/formatting-buttons/formatting-buttons';

type Props = {};
export const Toolbar: React.FC<Props> = () => {
  return (
    <div className={modToolbar.toolBar}>
      <FormattingButtons />
    </div>
  );
};

import * as React from 'react';
import { MainButtons } from '::app/editor/tool-bar/groups/main-buttons';
import { modToolbar } from '::sass-modules/index.ts';
import { MobileButtons } from './groups/mobile-buttons';
import { Separator } from '::app/editor/tool-bar/separator';
const FormattingButtons = React.lazy(() =>
  import('::app/editor/tool-bar/groups/formatting-buttons'),
);
type Props = {
  showFormattingButtons: boolean;
  isOnMobile: boolean;
  contentEditable: boolean;
};

const ToolBar: React.FC<Props> = ({
  showFormattingButtons,
  isOnMobile,
  contentEditable,
}) => {
  return (
    <div className={modToolbar.toolBar}>
      <MainButtons />
      <Separator />
      <MobileButtons contentEditable={contentEditable} />
      {(!isOnMobile || showFormattingButtons) && <FormattingButtons />}
    </div>
  );
};

export default ToolBar;

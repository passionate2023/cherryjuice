import * as React from 'react';
import { MainButtons } from '::app/tool-bar/groups/main-buttons';
import { FormattingButtons } from '::app/tool-bar/groups/formatting-buttons';
import { modToolbar } from '::sass-modules/index.ts';
import { MobileButtons } from './groups/mobile-buttons';
import { Separator } from '::app/tool-bar/separator';

type Props = {
  dispatch: (action: { type: string; value?: any }) => void;
  showFormattingButtons: boolean;
  isOnMobile: boolean;
  contentEditable: boolean;
};

const ToolBar: React.FC<Props> = ({
  dispatch,
  showFormattingButtons,
  isOnMobile,
  contentEditable,
}) => {
  return (
    <div className={modToolbar.toolBar}>
      <MainButtons dispatch={dispatch} />
      <Separator />
      <MobileButtons dispatch={dispatch} contentEditable={contentEditable}/>
      {(!isOnMobile || showFormattingButtons) && (
        <FormattingButtons dispatch={dispatch} />
      )}
    </div>
  );
};

export default ToolBar;

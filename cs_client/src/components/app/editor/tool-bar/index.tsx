import * as React from 'react';
import { MainButtons } from '::app/editor/tool-bar/groups/main-buttons';
import { modToolbar } from '::sass-modules/index.ts';
import { MobileButtons } from './groups/mobile-buttons';
import { Separator } from '::app/editor/tool-bar/separator';
import { createPortal } from 'react-dom';
import appModule from '::sass-modules/app.scss';
const FormattingButtons = React.lazy(() =>
  import('::app/editor/tool-bar/groups/formatting-buttons'),
);
type Props = {
  isOnMobile: boolean;
  showFormattingButtons: boolean;
  contentEditable: boolean;
  showRecentNodes: boolean;
  showInfoBar: boolean;
  showTree: boolean;
};

const ToolBar: React.FC<Props> = ({
  isOnMobile,
  showFormattingButtons,
  contentEditable,
  showRecentNodes,
  showInfoBar,
  showTree,
}) => {
  return (
    <div className={modToolbar.toolBar}>
      <MainButtons showTree={showTree} />
      <Separator />
      <MobileButtons
        {...{
          showFormattingButtons,
          contentEditable,
          showRecentNodes,
          showInfoBar,
        }}
      />
      {!isOnMobile ? (
        <FormattingButtons />
      ) : (
        showFormattingButtons &&
        createPortal(
          <FormattingButtons />,
          document.querySelector('.' + appModule.app),
        )
      )}
    </div>
  );
};

export default ToolBar;

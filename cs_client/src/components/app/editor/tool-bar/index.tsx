import * as React from 'react';
import { MainButtons } from '::app/editor/tool-bar/groups/main-buttons';
import { appModule, modToolbar } from '::sass-modules/index.ts';
import { MobileButtons } from './groups/mobile-buttons';
import { Separator } from '::app/editor/tool-bar/separator';
import { createPortal } from 'react-dom';
import {
  FormattingButtons,
  FormattingButtonsWithTransition,
} from './groups/formatting-buttons';
import { NavBar } from '::app/editor/tool-bar/groups/nav-bar/nav-bar';
import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::root/store/store';

const mapState = (state: Store) => ({
  isOnMobile: state.root.isOnMobile,
  showFormattingButtons: state.editor.showFormattingButtons,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};

const ToolBar: React.FC<Props & PropsFromRedux> = ({
  isOnMobile,
  showFormattingButtons,
}) => {
  return (
    <div className={modToolbar.toolBar}>
      <MainButtons />
      <Separator />
      <MobileButtons />
      {isOnMobile ? (
        createPortal(
          <FormattingButtonsWithTransition show={showFormattingButtons} />,
          document.querySelector('.' + appModule.app),
        )
      ) : (
        <FormattingButtons />
      )}
      {isOnMobile && <Separator />}
      <NavBar showUserPopup={false} />
    </div>
  );
};
const _ = connector(ToolBar);
export default _;

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
import { isDocumentOwner } from '::root/store/selectors/document/is-document-owner';
import { useEffect, useState } from 'react';

const Portal: React.FC<{ targetSelector: string }> = ({
  targetSelector,
  children,
}) => {
  const [targetMounted, serTargetMounted] = useState(false);
  useEffect(() => {
    const handle = setInterval(() => {
      if (document.querySelector(targetSelector)) {
        clearInterval(handle);
        serTargetMounted(true);
      }
      return () => clearInterval(handle);
    }, 100);
  }, []);
  return targetMounted ? (
    createPortal(children, document.querySelector(targetSelector))
  ) : (
    <></>
  );
};

const mapState = (state: Store) => ({
  isOnMobile: state.root.isOnMobile,
  showFormattingButtons: state.editor.showFormattingButtons,
  isDocumentOwner: isDocumentOwner(state),
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};

const ToolBar: React.FC<Props & PropsFromRedux> = ({
  isOnMobile,
  showFormattingButtons,
  isDocumentOwner,
}) => {
  return (
    <div className={modToolbar.toolBar}>
      <MainButtons />
      <MobileButtons />
      {isDocumentOwner &&
        (isOnMobile ? (
          <Portal targetSelector={'.' + appModule.app}>
            <FormattingButtonsWithTransition show={showFormattingButtons} />
          </Portal>
        ) : (
          <FormattingButtons />
        ))}
      {isDocumentOwner && isOnMobile && <Separator />}
      <NavBar showUserPopup={false} />
    </div>
  );
};
const _ = connector(ToolBar);
export default _;

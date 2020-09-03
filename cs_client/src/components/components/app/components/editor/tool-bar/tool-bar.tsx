import * as React from 'react';
import { MainButtons } from '::root/components/app/components/editor/tool-bar/components/groups/main-buttons/main-buttons';
import { appModule, modToolbar } from '::sass-modules';
import { MobileButtons } from './components/groups/mobile-buttons/mobile-buttons';
import { createPortal } from 'react-dom';
import {
  FormattingButtons,
  FormattingButtonsWithTransition,
} from './components/groups/formatting-buttons/formatting-buttons';
import { NavBar } from '::root/components/app/components/editor/tool-bar/components/groups/nav-bar/nav-bar';
import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::store/store';
import { hasWriteAccessToDocument } from '::store/selectors/document/has-write-access-to-document';
import { useEffect, useState } from 'react';
import { NodesButtons } from '::root/components/app/components/editor/tool-bar/components/groups/nodes-buttons/nodes-buttons';
import { UndoRedo } from '::root/components/app/components/editor/tool-bar/components/groups/main-buttons/undo-redo/undo-redo';
import { Separator } from '::root/components/app/components/editor/tool-bar/components/separator';

type PortalProps = { targetSelector: string; predicate?: boolean };
export const Portal: React.FC<PortalProps> = ({
  targetSelector,
  children,
  predicate = true,
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
  return predicate ? (
    targetMounted ? (
      createPortal(children, document.querySelector(targetSelector))
    ) : (
      <></>
    )
  ) : (
    <>{children}</>
  );
};

const mapState = (state: Store) => ({
  isOnMd: state.root.isOnMd,
  docking: state.root.docking,
  showFormattingButtons: state.editor.showFormattingButtons,
  isDocumentOwner: hasWriteAccessToDocument(state),
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};

const ToolBar: React.FC<Props & PropsFromRedux> = ({
  isOnMd,
  showFormattingButtons,
  isDocumentOwner,
  docking,
}) => {
  return (
    <div className={modToolbar.toolBar}>
      <MainButtons />
      {isDocumentOwner && !isOnMd && <Separator />}
      <Portal targetSelector={'.' + appModule.app} predicate={isOnMd}>
        {!docking && (
          <NodesButtons>
            <UndoRedo />
            <MobileButtons />
          </NodesButtons>
        )}
      </Portal>
      {isDocumentOwner && !isOnMd && <Separator />}
      {!docking && isDocumentOwner && (
        <Portal targetSelector={'.' + appModule.app} predicate={isOnMd}>
          {isOnMd ? (
            <FormattingButtonsWithTransition show={showFormattingButtons} />
          ) : (
            <FormattingButtons />
          )}
        </Portal>
      )}
      <NavBar showUserPopup={false} />
    </div>
  );
};
const _ = connector(ToolBar);
export default _;

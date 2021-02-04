import * as React from 'react';
import { memo, useEffect, useState } from 'react';
import { MainButtons } from '::root/components/app/components/editor/tool-bar/components/groups/main-buttons/main-buttons';
import { modToolbar } from '::sass-modules';
import { MobileButtons } from './components/groups/mobile-buttons/mobile-buttons';
import { createPortal } from 'react-dom';
import { FormattingButtons } from './components/groups/formatting-buttons/formatting-buttons';
import { NavBar } from '::root/components/app/components/editor/tool-bar/components/groups/nav-bar/nav-bar';
import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::store/store';
import { hasWriteAccessToDocument } from '::store/selectors/document/has-write-access-to-document';
import { Separator } from '::root/components/app/components/editor/tool-bar/components/separator';
import { ErrorBoundary } from '::root/components/shared-components/react/error-boundary';
import { FormattingButtonsWithTransition } from '::app/components/editor/tool-bar/components/groups/formatting-buttons/formatting-buttons-with-transition';
import { useComponentIsReady } from '::root/hooks/is-ready';
import { modEditor } from '::app/components/editor/editor';
import { joinClassNames } from '@cherryjuice/shared-helpers';

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
  isOnMd: state.root.isOnTb,
  docking: state.root.docking,
  showFormattingButtons: state.editor.showFormattingButtons,
  isDocumentOwner: hasWriteAccessToDocument(state),
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = Record<string, never>;

const ToolBar: React.FC<Props & PropsFromRedux> = ({
  isOnMd,
  showFormattingButtons,
  isDocumentOwner,
  docking,
}) => {
  useComponentIsReady(true);
  const hideDuringDocking = docking && isOnMd;
  return (
    <div className={modToolbar.toolBar}>
      {!isOnMd && <MainButtons />}
      {isDocumentOwner && !isOnMd && <Separator />}
      {isOnMd && (
        <Portal targetSelector={'.' + modEditor.editor} predicate={isOnMd}>
          <div
            className={joinClassNames([
              modToolbar.toolBar__group,
              modToolbar.toolBar__groupMainBar,
            ])}
          >
            <MainButtons>
              <Separator />
              <MobileButtons />
            </MainButtons>
            <NavBar />
          </div>
        </Portal>
      )}
      {isDocumentOwner && (
        <ErrorBoundary>
          <Portal targetSelector={'.' + modEditor.editor} predicate={isOnMd}>
            {isOnMd ? (
              <FormattingButtonsWithTransition show={showFormattingButtons} />
            ) : (
              !hideDuringDocking && <FormattingButtons />
            )}
          </Portal>
        </ErrorBoundary>
      )}
      {!isOnMd && <NavBar />}
    </div>
  );
};
const _ = connector(ToolBar);
const M = memo(_);
export default M;

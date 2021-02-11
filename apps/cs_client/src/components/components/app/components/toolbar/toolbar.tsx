import * as React from 'react';
import mod from './toolbar.scss';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::store/store';
import { Tabs } from '::app/components/tabs/tabs';
import { useRef } from 'react';
import { ToolbarButton } from '::app/components/toolbar/components/toolbar-button/toolbar-button';
import { NavBar } from '::app/components/toolbar/components/nav-bar/nav-bar';
import { MobileButtons } from '::app/components/toolbar/components/mobile-buttons/mobile-buttons';
import { hasWriteAccessToDocument } from '::store/selectors/document/has-write-access-to-document';
import { Portal } from '::app/components/editor/editor-toolbar/editor-toolbar';
import { modApp } from '::sass-modules';
import { Separator } from '::app/components/editor/editor-toolbar/components/separator';

const mapState = (state: Store) => {
  return {
    showHome: state.home.show,
    isAuthenticated: !!state.auth.user?.id,
    showTree: state.editor.showTree,
    documentId: state.document.documentId,
    tb: state.root.isOnTb,
    isDocumentOwner: hasWriteAccessToDocument(state),
  };
};
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = Record<string, never>;

const Toolbar: React.FC<Props & PropsFromRedux> = ({
  showHome,
  isAuthenticated,
  documentId,
  tb,
  isDocumentOwner,
}) => {
  const ref = useRef<HTMLDivElement>();

  return (
    <>
      <div className={mod.toolbar} ref={ref}>
        {isAuthenticated && (
          <ToolbarButton
            onClick={ac.home.show}
            tooltip={{ label: 'home', position: 'bottom-right' }}
            icon={'home'}
            iconIsImage={true}
            active={showHome}
          />
        )}
        {documentId && (
          <ToolbarButton
            onClick={showHome ? ac.home.hide : ac.editor.toggleTree}
            tooltip={{ label: 'Toggle tree', position: 'bottom-right' }}
            icon={'tree'}
            iconIsImage={true}
          />
        )}
        {isDocumentOwner && tb && !showHome && (
          <>
            <Separator />
            <MobileButtons />
          </>
        )}
        {(!showHome || !tb) && documentId && (
          <Portal targetSelector={'.' + modApp.app} predicate={tb}>
            <Tabs />
          </Portal>
        )}
        <NavBar />
      </div>
    </>
  );
};

const _ = connector(Toolbar);
export { _ as Toolbar };
export { mod as modToolbar };

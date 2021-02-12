import * as React from 'react';
import mod from './editor-toolbar.scss';
import { StaticEditorToolbar } from './components/static-editor-toolbar/static-editor-toolbar';
import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::store/store';
import { hasWriteAccessToDocument } from '::store/selectors/document/has-write-access-to-document';
import { ErrorBoundary } from '::root/components/shared-components/react/error-boundary';
import { AnimatedEditorToolbar } from '::app/components/editor/editor-toolbar/components/animated-editor-toolbar/animated-editor-toolbar';
import { useComponentIsReady } from '::root/hooks/is-ready';
import { modEditor } from '::app/components/editor/editor';
import { Portal } from '@cherryjuice/components';

const mapState = (state: Store) => ({
  isOnMd: state.root.isOnTb,
  docking: state.root.docking,
  showFormattingButtons: state.editor.showFormattingButtons,
  isDocumentOwner: hasWriteAccessToDocument(state),
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

const EditorToolbar: React.FC<PropsFromRedux> = ({
  isOnMd,
  showFormattingButtons,
  isDocumentOwner,
  docking,
}) => {
  useComponentIsReady(true);
  const hideDuringDocking = docking && isOnMd;
  return (
    <>
      {isDocumentOwner && (
        <div className={mod.editorToolbar}>
          <ErrorBoundary>
            <Portal targetSelector={'.' + modEditor.editor} predicate={isOnMd}>
              {isOnMd ? (
                <AnimatedEditorToolbar show={showFormattingButtons} />
              ) : (
                !hideDuringDocking && <StaticEditorToolbar />
              )}
            </Portal>
          </ErrorBoundary>
        </div>
      )}
    </>
  );
};
const _ = connector(EditorToolbar);
export default _;

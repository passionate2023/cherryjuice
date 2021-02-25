import * as React from 'react';
import mod from './editor-toolbar.scss';
import { StaticEditorToolbar } from './components/static-editor-toolbar/static-editor-toolbar';
import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::store/store';
import { hasWriteAccessToDocument } from '::store/selectors/document/has-write-access-to-document';
import { ErrorBoundary } from '::root/components/shared-components/react/error-boundary';
import { AnimatedEditorToolbar } from '::app/components/editor/editor-toolbar/components/animated-editor-toolbar/animated-editor-toolbar';
import { modEditor } from '::app/components/editor/editor';
import { Portal } from '@cherryjuice/components';
import { useCurrentBreakpoint } from '@cherryjuice/shared-helpers';

const mapState = (state: Store) => ({
  docking: state.root.docking,
  showFormattingButtons: state.editor.showFormattingButtons,
  isDocumentOwner: hasWriteAccessToDocument(state),
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

const EditorToolbar: React.FC<PropsFromRedux> = ({
  showFormattingButtons,
  isDocumentOwner,
  docking,
}) => {
  const { mbOrTb } = useCurrentBreakpoint();
  const hideDuringDocking = docking && mbOrTb;
  return (
    <>
      {isDocumentOwner && (
        <div className={mod.editorToolbar}>
          <ErrorBoundary>
            <Portal targetSelector={'.' + modEditor.editor} predicate={mbOrTb}>
              {mbOrTb ? (
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

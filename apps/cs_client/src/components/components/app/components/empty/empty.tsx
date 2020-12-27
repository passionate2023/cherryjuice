import * as React from 'react';
import { Store } from '::store/store';
import { hasWriteAccessToDocument } from '::store/selectors/document/has-write-access-to-document';
import { connect, ConnectedProps } from 'react-redux';
import { useUpdateCssVariables } from '::app/hooks/update-css-variables';
import { useGetPreviousOperations } from '::app/hooks/get-previous-operations';
import { useGetActiveOperations } from '::app/hooks/get-active-operations';
import { useApplyEditorSettings } from '::app/hooks/apply-editor-settings';
import { useInitEditorBridge } from '::app/hooks/init-editor-bridge';

const mapState = (state: Store) => ({
  showTree: state.editor.showTree,
  showRecentNodes: state.editor.showRecentNodesBar,
  treeWidth: state.cssVariables.treeWidth,
  previousTreeWidth: state.cssVariables.previous.treeWidth,
  showFormattingButtons: state.editor.showFormattingButtons,
  dockedDialog: state.root.dockedDialog,
  isDocumentOwner: hasWriteAccessToDocument(state),
  userId: state.auth.user?.id,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};

const Empty: React.FC<Props & PropsFromRedux> = ({
  isDocumentOwner,
  showFormattingButtons,
  showTree,
  showRecentNodes,
  treeWidth,
  previousTreeWidth,
  userId,
}) => {
  useUpdateCssVariables(
    isDocumentOwner,
    showFormattingButtons,
    showTree,
    showRecentNodes,
    treeWidth,
    previousTreeWidth,
  );
  useGetPreviousOperations();
  useGetActiveOperations(userId);
  useApplyEditorSettings();
  useInitEditorBridge();
  return <div></div>;
};

const _ = connector(Empty);
export { _ as Empty };

import * as React from 'react';
import { ac, Store } from '::store/store';
import { hasWriteAccessToDocument } from '::store/selectors/document/has-write-access-to-document';
import { connect, ConnectedProps } from 'react-redux';
import { useUpdateCssVariables } from '::app/hooks/update-css-variables';
import { useGetPreviousOperations } from '::app/hooks/get-previous-operations';
import { useGetActiveOperations } from '::app/hooks/get-active-operations';
import { useApplyEditorSettings } from '::app/hooks/apply-editor-settings';
import { useInitEditorBridge } from '::app/hooks/init-editor-bridge';
import { useCurrentBreakpoint } from '@cherryjuice/shared-helpers';

const mapState = (state: Store) => ({
  showRecentNodes: state.editor.showRecentNodesBar,
  showFormattingButtons: state.editor.showFormattingButtons,
  dockedDialog: state.root.dockedDialog,
  isDocumentOwner: hasWriteAccessToDocument(state),
  userId: state.auth.user?.id,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

const Empty: React.FC<PropsFromRedux> = ({
  isDocumentOwner,
  showFormattingButtons,
  showRecentNodes,
  userId,
}) => {
  useUpdateCssVariables(
    isDocumentOwner,
    showFormattingButtons,
    showRecentNodes,
  );
  useGetPreviousOperations(userId);
  useGetActiveOperations(userId);
  useApplyEditorSettings();
  useInitEditorBridge();

  useCurrentBreakpoint(ac.root.setBreakpoint);

  return <div></div>;
};

const _ = connector(Empty);
export { _ as Empty };

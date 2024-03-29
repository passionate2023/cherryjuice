import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::store/store';
import { hasWriteAccessToDocument } from '::store/selectors/document/has-write-access-to-document';
import { ErrorBoundary } from '::root/components/shared-components/react/error-boundary';
import { getCurrentDocument } from '::store/selectors/cache/document/document';
import { useEffect } from 'react';
import { OfflineBanner } from '::root/components/app/components/editor/document/components/editor-container/components/offline-banner';
import { ContentEditableProps, Editor } from '@cherryjuice/editor';
import { useCurrentBreakpoint, useLoader } from '@cherryjuice/shared-helpers';
import { EditorSkeleton } from '::app/components/editor/components/editor-skeleton';

const mapState = (state: Store) => {
  const document = getCurrentDocument(state);
  const node_id = document?.persistedState?.selectedNode_id;
  return {
    fetchDocumentInProgress:
      state.document.asyncOperations.fetch === 'in-progress',
    fetchNodeStarted:
      state.node.asyncOperations.fetch[node_id] === 'in-progress',
    contentEditable: state.editor.contentEditable,
    isDocumentOwner: hasWriteAccessToDocument(state),
    online: state.root.online,
    scrollPosition: document
      ? document.persistedState.scrollPositions[node_id]
      : undefined,
    node: document?.nodes && document?.nodes[node_id],
  };
};
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;
const EditorContainer: React.FC<PropsFromRedux> = ({
  contentEditable,
  fetchDocumentInProgress,
  fetchNodeStarted,
  isDocumentOwner,
  node,
  scrollPosition,
  online,
}) => {
  const { mbOrTb } = useCurrentBreakpoint();
  contentEditable = contentEditable || !mbOrTb;
  useEffect(() => {
    if (online)
      if (node && !node?.html && !fetchDocumentInProgress) ac.node.fetch(node);
  }, [node?.node_id, node?.documentId, fetchDocumentInProgress, online]);
  const gestureHandlerProps = {
    onRight: ac.editor.showTree,
    onLeft: ac.editor.hideTree,
    onTap: ac.root.hidePopups,
    minimumLength: 170,
  };

  const contentEditableProps: ContentEditableProps = {
    editable: Boolean(!node?.read_only && contentEditable && isDocumentOwner),
    focusOnUpdate: !mbOrTb,
    html: node?.html,
    images: node?.image,
    nodeId: node?.node_id ? node.documentId + '/' + node.node_id : undefined,
    scrollPosition,
  };
  const loading = useLoader({
    waitBeforeShowing: 1000,
    minimumLoadingDuration: 1000,
    loading: !node?.html || fetchDocumentInProgress || fetchNodeStarted,
  });
  return (
    <ErrorBoundary>
      <Editor
        contentEditableProps={contentEditableProps}
        gestureHandlerProps={gestureHandlerProps}
        loading={loading}
        fallbackComponent={online ? <EditorSkeleton /> : <OfflineBanner />}
        style={{ zIndex: 1 }}
      />
    </ErrorBoundary>
  );
};
const _ = connector(EditorContainer);
export { _ as EditorContainer };

import * as React from 'react';
import { SpinnerCircle } from '::root/components/shared-components/loading-indicator/spinner-circle';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::store/store';
import { hasWriteAccessToDocument } from '::store/selectors/document/has-write-access-to-document';
import { ErrorBoundary } from '::root/components/shared-components/react/error-boundary';
import { getCurrentDocument } from '::store/selectors/cache/document/document';
import { useEffect } from 'react';
import { QFullNode } from '::store/ducks/document-cache/document-cache';
import { OfflineBanner } from '::root/components/app/components/editor/document/components/editor-container/components/offline-banner';
import { ContentEditableProps, Editor } from '@cherryjuice/editor';
import { useCurrentBreakpoint } from '@cherryjuice/shared-helpers';

type Props = {
  node: QFullNode;
};

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
  };
};
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;
const EditorContainer: React.FC<Props & PropsFromRedux> = ({
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
  return (
    <ErrorBoundary>
      <Editor
        contentEditableProps={contentEditableProps}
        gestureHandlerProps={gestureHandlerProps}
        loading={!node?.html || fetchDocumentInProgress || fetchNodeStarted}
        fallbackComponent={online ? <SpinnerCircle /> : <OfflineBanner />}
        style={{ zIndex: 1 }}
      />
    </ErrorBoundary>
  );
};
const _ = connector(EditorContainer);
export { _ as EditorContainer };

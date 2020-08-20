import { modRichText } from '::sass-modules';
import * as React from 'react';
import { SpinnerCircle } from '::root/components/shared-components/loading-indicator/spinner-circle';
import { ContentEditable } from '::root/components/app/components/editor/document/components/rich-text/components/content-editable';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::store/store';
import { hasWriteAccessToDocument } from '::store/selectors/document/has-write-access-to-document';
import { ErrorBoundary } from '::root/components/shared-components/react/error-boundary';
import { getCurrentDocument } from '::store/selectors/cache/document/document';
import { useLayoutEffect } from 'react';

type Props = {};

const mapState = (state: Store) => {
  const document = getCurrentDocument(state);
  const node_id = document.state.selectedNode_id;
  return {
    fetchDocumentInProgress:
      state.document.asyncOperations.fetch === 'in-progress',
    fetchNodeStarted:
      state.node.asyncOperations.fetch[node_id] === 'in-progress',
    contentEditable: state.editor.contentEditable || !state.root.isOnMobile,
    processLinks: state.node.processLinks,
    isDocumentOwner: hasWriteAccessToDocument(state),
    nodes: document.nodes,
    file_id: state.document.documentId,
    node_id: node_id,
  };
};
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;
const RichText: React.FC<Props & PropsFromRedux> = ({
  file_id,
  contentEditable,
  nodes,
  processLinks,
  fetchDocumentInProgress,
  fetchNodeStarted,
  isDocumentOwner,
  node_id,
}) => {
  const node = nodes[node_id];
  const nodeId = node?.id;
  const html = node?.html;
  const images = node?.image;

  useLayoutEffect(() => {
    if (!fetchDocumentInProgress)
      ac.node.fetch({ documentId: file_id, node_id });
  }, [node_id, file_id, fetchDocumentInProgress]);
  return (
    <ErrorBoundary>
      <div className={modRichText.richText__container}>
        {html && !fetchDocumentInProgress && !fetchNodeStarted ? (
          <ContentEditable
            isDocumentOwner={isDocumentOwner}
            contentEditable={contentEditable}
            html={html}
            nodeId={nodeId}
            file_id={file_id}
            node_id={node_id}
            processLinks={[processLinks]}
            images={images}
            fetchNodeStarted={fetchNodeStarted}
          />
        ) : (
          <SpinnerCircle />
        )}
      </div>
    </ErrorBoundary>
  );
};
const _ = connector(RichText);
export { _ as RichText };

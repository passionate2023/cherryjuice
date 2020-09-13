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
import { QFullNode } from '::store/ducks/cache/document-cache';

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
    contentEditable: state.editor.contentEditable || !state.root.isOnMd,
    processLinks: state.node.processLinks,
    isDocumentOwner: hasWriteAccessToDocument(state),
    isOnMd: state.root.isOnMd,
    scrollPosition:
      document?.persistedState?.scrollPositions &&
      document.persistedState.scrollPositions[node_id],
  };
};
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;
const RichText: React.FC<Props & PropsFromRedux> = ({
  contentEditable,
  processLinks,
  fetchDocumentInProgress,
  fetchNodeStarted,
  isDocumentOwner,
  node,
  isOnMd,
  scrollPosition,
}) => {
  useLayoutEffect(() => {
    if (!node?.html && !fetchDocumentInProgress) ac.node.fetch(node);
  }, [node?.node_id, node?.documentId, fetchDocumentInProgress]);
  const nodeId = node?.id;
  const html = node?.html;
  const images = node?.image;

  return (
    <ErrorBoundary>
      <div className={modRichText.richText__container}>
        {html && !fetchDocumentInProgress && !fetchNodeStarted ? (
          <ContentEditable
            isDocumentOwner={isDocumentOwner}
            contentEditable={contentEditable}
            html={html}
            nodeId={nodeId}
            file_id={node.documentId}
            node_id={node.node_id}
            processLinks={[processLinks]}
            images={images}
            fetchNodeStarted={fetchNodeStarted}
            isOnMd={isOnMd}
            scrollPosition={scrollPosition}
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

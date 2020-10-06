import { modRichText } from '::sass-modules';
import * as React from 'react';
import { SpinnerCircle } from '::root/components/shared-components/loading-indicator/spinner-circle';
import { ContentEditable } from '::root/components/app/components/editor/document/components/rich-text/components/content-editable';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::store/store';
import { hasWriteAccessToDocument } from '::store/selectors/document/has-write-access-to-document';
import { ErrorBoundary } from '::root/components/shared-components/react/error-boundary';
import { getCurrentDocument } from '::store/selectors/cache/document/document';
import { useEffect, useMemo } from 'react';
import { QFullNode } from '::store/ducks/cache/document-cache';
import { OfflineBanner } from '::root/components/app/components/editor/document/components/rich-text/components/offline-banner';
import { onPaste } from '::helpers/editing/clipboard';
import { onKeyDown } from '::helpers/editing/typing';
import { createGesturesHandler } from '::root/components/shared-components/drawer/components/drawer-navigation/helpers/create-gestures-handler';
import { useMouseClick } from '::root/components/app/components/editor/document/components/rich-text/hooks/on-mouse-event';
import { useScrollToHash } from '::root/components/app/components/editor/document/components/rich-text/hooks/scroll-to-hash';

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
    isDocumentOwner: hasWriteAccessToDocument(state),
    isOnMd: state.root.isOnMd,
    online: state.root.online,
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
  fetchDocumentInProgress,
  fetchNodeStarted,
  isDocumentOwner,
  node,
  isOnMd,
  scrollPosition,
  online,
}) => {
  useEffect(() => {
    if (online)
      if (node && !node?.html && !fetchDocumentInProgress) ac.node.fetch(node);
  }, [node?.node_id, node?.documentId, fetchDocumentInProgress, online]);
  const nodeId = node?.id;
  const html = node?.html;
  const images = node?.image;
  const { onTouchEnd, onTouchStart } = useMemo(
    () =>
      createGesturesHandler({
        onRight: ac.editor.showTree,
        onLeft: ac.editor.hideTree,
        onTap: ac.root.hidePopups,
        minimumLength: 170,
      }),
    [],
  );
  useMouseClick();
  useScrollToHash();
  return (
    <ErrorBoundary>
      <div
        className={modRichText.richText__container}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onPaste={onPaste}
        onKeyDown={onKeyDown}
      >
        {html && !fetchDocumentInProgress && !fetchNodeStarted ? (
          <ContentEditable
            isDocumentOwner={isDocumentOwner}
            contentEditable={contentEditable}
            html={html}
            nodeId={nodeId}
            documentId={node.documentId}
            read_only={!!node.read_only}
            node_id={node.node_id}
            images={images}
            isOnMd={isOnMd}
            scrollPosition={scrollPosition}
          />
        ) : online ? (
          <SpinnerCircle />
        ) : (
          <OfflineBanner />
        )}
      </div>
    </ErrorBoundary>
  );
};
const _ = connector(RichText);
export { _ as RichText };

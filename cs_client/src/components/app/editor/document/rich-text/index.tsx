import { modRichText } from '::sass-modules';
import * as React from 'react';
import { useRouteMatch } from 'react-router';
import { SpinnerCircle } from '::shared-components/spinner-circle';
import { useGetNodeHtml } from '::app/editor/document/rich-text/hooks/get-node-html';
import { useSetCurrentNode } from '::app/editor/document/rich-text/hooks/set-current-node';
import { ContentEditable } from '::app/editor/document/rich-text/content-editable';
import { useEffect } from 'react';
import { apolloCache } from '::graphql/cache/apollo-cache';
import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::root/store/store';
import { router } from '::root/router/router';
import { hasWriteAccessToDocument } from '::root/store/selectors/document/has-write-access-to-document';
import { ErrorBoundary } from '::shared-components/error-boundary';

type Props = {};

const mapState = (state: Store) => ({
  fetchNodesStarted: state.document.fetchNodesStarted,
  contentEditable: state.editor.contentEditable || !state.root.isOnMobile,
  processLinks: state.node.processLinks,
  isDocumentOwner: hasWriteAccessToDocument(state),
  nodes: state.document.nodes,
  file_id: state.document.documentId,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;
const RichText: React.FC<Props & PropsFromRedux> = ({
  file_id,
  contentEditable,
  nodes,
  processLinks,
  fetchNodesStarted,
  isDocumentOwner,
}) => {
  const match = useRouteMatch();
  // @ts-ignore
  const node_id = Number(match.params?.node_id);
  const nodeId = nodes?.get(node_id)?.id;
  const {
    html,
    error: htmlError,
    processLinks: processLinksDueToHtmlChange,
  } = useGetNodeHtml({
    node_id,
    file_id,
    nodeId,
    reloadRequestIDs: [fetchNodesStarted],
  });

  useSetCurrentNode(node_id, nodes);

  useEffect(() => {
    const nodeIsNew = apolloCache.changes.isNodeNew(nodeId);
    if (htmlError && !nodeIsNew) {
      router.goto.document(file_id);
    }
  }, [htmlError]);

  return (
    <ErrorBoundary>
      <div className={modRichText.richText__container}>
        {html?.htmlRaw && !fetchNodesStarted ? (
          <ContentEditable
            isDocumentOwner={isDocumentOwner}
            contentEditable={contentEditable}
            html={html.htmlRaw}
            nodeId={nodes.get(node_id)?.id}
            file_id={file_id}
            node_id={node_id}
            processLinks={[processLinksDueToHtmlChange, processLinks]}
          />
        ) : (
          !htmlError && <SpinnerCircle />
        )}
      </div>
    </ErrorBoundary>
  );
};
const _ = connector(RichText);
export { _ as RichText };

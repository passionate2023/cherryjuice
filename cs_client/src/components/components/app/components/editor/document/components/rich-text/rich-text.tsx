import { modRichText } from '::sass-modules';
import * as React from 'react';
import { useRouteMatch } from 'react-router';
import { SpinnerCircle } from '::root/components/shared-components/loading-indicator/spinner-circle';
import { useSetCurrentNode } from '::root/components/app/components/editor/document/components/rich-text/hooks/set-current-node';
import { ContentEditable } from '::root/components/app/components/editor/document/components/rich-text/components/content-editable';
import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::store/store';
import { hasWriteAccessToDocument } from '::store/selectors/document/has-write-access-to-document';
import { ErrorBoundary } from '::root/components/shared-components/react/error-boundary';
import { getCurrentDocument } from '::store/selectors/cache/document/document';

type Props = {};

const mapState = (state: Store) => ({
  fetchNodesStarted: state.document.fetchNodesStarted,
  fetchNodeStarted: state.node.fetchInProgress,
  contentEditable: state.editor.contentEditable || !state.root.isOnMobile,
  processLinks: state.node.processLinks,
  isDocumentOwner: hasWriteAccessToDocument(state),
  nodes: getCurrentDocument(state).nodes,
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
  fetchNodeStarted,
  isDocumentOwner,
}) => {
  const match = useRouteMatch();
  // @ts-ignore
  const node_id = Number(match.params?.node_id);
  const node = nodes[node_id];
  const nodeId = node?.id;
  const html = node?.html;
  const images = node?.image;
  useSetCurrentNode(node_id, nodes, file_id);

  return (
    <ErrorBoundary>
      <div className={modRichText.richText__container}>
        {html && !fetchNodesStarted && !fetchNodeStarted ? (
          <ContentEditable
            isDocumentOwner={isDocumentOwner}
            contentEditable={contentEditable}
            html={html}
            nodeId={nodeId}
            file_id={file_id}
            node_id={node_id}
            processLinks={[processLinks]}
            images={images}
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

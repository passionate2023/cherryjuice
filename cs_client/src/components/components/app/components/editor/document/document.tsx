import * as React from 'react';
import { Fragment, useEffect, useReducer } from 'react';
import { ErrorBoundary } from '::root/components/shared-components/react/error-boundary';
import { Tree } from './components/tree/tree';
import { Route, useRouteMatch } from 'react-router-dom';
import { LinearProgress } from '::root/components/shared-components/loading-indicator/linear-progress';
import { RecentNodes } from './components/recent-nodes/recent-nodes';
import { RichText } from '::root/components/app/components/editor/document/components/rich-text/rich-text';
import { documentReducer } from '::root/components/app/components/editor/document/reducer/reducer';
import { documentInitialState } from '::root/components/app/components/editor/document/reducer/initial-state';
import { documentActionCreators } from '::root/components/app/components/editor/document/reducer/action-creators';
import { DocumentContext } from './reducer/context';
import { useTrackDocumentChanges } from '::root/components/app/components/editor/document/hooks/track-document-changes';
import { Store } from '::store/store';
import { connect, ConnectedProps } from 'react-redux';
import { ac } from '::store/store';
import { setHighestNodeId } from '::root/components/app/components/editor/document/hooks/get-document-meta/helpers/set-highset-node_id';
import { router } from '::root/router/router';

const mapState = (state: Store) => ({
  nodes: state.document.nodes,
  fetchNodesStarted: state.document.fetchNodesStarted,
  cacheTimeStamp: state.document.cacheTimeStamp,
  saveInProgress: state.document.saveInProgress,
  selectedNode: state.document.selectedNode,
  recentNodes: state.document.recentNodes,
  showTree: state.editor.showTree,
  showRecentNodesBar: state.editor.showRecentNodesBar,
});

const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};

const Document: React.FC<Props & PropsFromRedux> = ({
  nodes,
  fetchNodesStarted,
  cacheTimeStamp,
  saveInProgress,
  selectedNode,
  recentNodes,
  showTree,
  showRecentNodesBar,
}) => {
  const [documentState, dispatch] = useReducer(
    documentReducer,
    documentInitialState,
  );
  useEffect(() => {
    documentActionCreators.setDispatch(dispatch);
  }, []);
  const match = useRouteMatch<{ file_id: string }>();
  const { file_id } = match.params;

  useEffect(() => {
    setHighestNodeId(nodes);
  }, [nodes]);
  useEffect(() => {
    if (selectedNode.node_id) router.goto.node(file_id, selectedNode.node_id);
  }, [selectedNode.node_id, file_id]);
  useTrackDocumentChanges({ cacheTimeStamp, documentId: file_id });
  useEffect(() => {
    if (router.get.location.pathname.endsWith(file_id))
      ac.document.clearSelectedNode();
  }, [router.get.location.pathname]);

  useEffect(() => {
    ac.document.setDocumentId(file_id);
    ac.document.clearSelectedNode();
  }, [file_id]);
  return (
    <DocumentContext.Provider value={documentState}>
      <LinearProgress
        loading={Boolean(fetchNodesStarted) || saveInProgress !== 'idle'}
      />
      {nodes && (
        <Fragment>
          {Boolean(selectedNode.node_id) && (
            <RecentNodes
              showRecentNodes={showRecentNodesBar}
              file_id={file_id}
              recentNodes={recentNodes}
              selectedNode_id={selectedNode.node_id}
              nodes={nodes}
            />
          )}
          {showTree && (
            <ErrorBoundary>
              <Tree />
            </ErrorBoundary>
          )}

          <Route
            exact
            path={`/document/:file_id/node/:node_id/`}
            component={RichText}
          />
        </Fragment>
      )}
    </DocumentContext.Provider>
  );
};

export default connector(Document);

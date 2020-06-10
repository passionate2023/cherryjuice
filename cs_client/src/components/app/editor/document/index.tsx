import * as React from 'react';
import { Fragment, useEffect, useReducer } from 'react';
import { ErrorBoundary } from '::shared-components/error-boundary';
import { Tree } from './tree';
import { Route, useRouteMatch } from 'react-router-dom';
import { LinearProgress } from '::shared-components/linear-progress';
import { RecentNodes } from './recent-nodes/recent-nodes';
import { RichText } from '::app/editor/document/rich-text';
import { appActionCreators, TState } from '::app/reducer';
import { documentReducer } from '::app/editor/document/reducer/reducer';
import { documentInitialState } from '::app/editor/document/reducer/initial-state';
import { documentActionCreators } from '::app/editor/document/reducer/action-creators';
import { DocumentContext } from './reducer/context';
import { useTrackDocumentChanges } from '::app/editor/document/hooks/track-document-changes';
import { Store } from '::root/store';
import { connect, ConnectedProps } from 'react-redux';
import { ac } from '::root/store/actions.types';
import { setHighestNodeId } from '::app/editor/document/hooks/get-document-meta/helpers/set-highset-node_id';
import { navigate } from '::root/router/navigate';
import { asyncOperation } from '::root/store/ducks/document';

const mapState = (state: Store) => ({
  nodes: state.document.nodes,
  fetchNodesStarted: state.document.fetchNodesStarted,
  cacheTimeStamp: state.document.cacheTimeStamp,
  saveInProgress: state.document.saveInProgress,
  selectedNode: state.document.selectedNode,
  recentNodes: state.document.recentNodes,
});

const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {
  state: TState;
};

const Document: React.FC<Props & PropsFromRedux> = ({
  state,
  nodes,
  fetchNodesStarted,
  cacheTimeStamp,
  saveInProgress,
  selectedNode,
  recentNodes,
}) => {
  const { showTree, contentEditable, isOnMobile, processLinks } = state;
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
  useTrackDocumentChanges({ cacheTimeStamp });
  useEffect(() => {
    if (navigate.location.pathname.endsWith(file_id)) ac.document.clearSelectedNode();
  }, [navigate.location.pathname]);

  useEffect(() => {
    ac.document.setDocumentId(file_id);
    appActionCreators.showTree();
    ac.document.clearSelectedNode();
  }, [file_id]);

  return (
    <DocumentContext.Provider value={documentState}>
      <LinearProgress
        loading={
          Boolean(fetchNodesStarted) || saveInProgress !== asyncOperation.idle
        }
      />
      {nodes && (
        <Fragment>
          {Boolean(selectedNode.node_id) && (
            <RecentNodes
              isOnMobile={state.isOnMobile}
              showRecentNodes={state.showRecentNodes}
              file_id={file_id}
              recentNodes={recentNodes}
              selectedNode_id={selectedNode.node_id}
              nodes={nodes}
            />
          )}
          {showTree && (
            <ErrorBoundary>
              <Tree nodes={nodes} />
            </ErrorBoundary>
          )}

          <Route
            exact
            path={`/document/:file_id/node/:node_id/`}
            render={props => {
              return (
                <ErrorBoundary>
                  <RichText
                    {...props}
                    nodes={nodes}
                    file_id={file_id}
                    contentEditable={contentEditable || !isOnMobile}
                    processLinks={processLinks}
                  />
                </ErrorBoundary>
              );
            }}
          />
        </Fragment>
      )}
    </DocumentContext.Provider>
  );
};

export default connector(Document);

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

const mapState = (state: Store) => ({
  nodes: state.document.nodes,
  fetchNodesStarted: state.document.fetchNodesStarted,
  cacheTimeStamp: state.document.cacheTimeStamp,
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
    if (navigate.location.pathname.endsWith(file_id))
      appActionCreators.selectNode(undefined);
  }, [navigate.location.pathname]);

  // temp hooks
  useEffect(() => {
    ac.document.setDocumentId(file_id);
    appActionCreators.showTree();
    appActionCreators.selectNode(undefined);
  }, [file_id]);

  return (
    <DocumentContext.Provider value={documentState}>
      <LinearProgress loading={fetchNodesStarted} />
      {nodes && (
        <Fragment>
          {state.selectedNode && (
            <RecentNodes state={state} file_id={file_id} />
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

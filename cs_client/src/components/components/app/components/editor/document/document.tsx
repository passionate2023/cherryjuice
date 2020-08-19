import * as React from 'react';
import { Fragment, useEffect, useReducer } from 'react';
import { ErrorBoundary } from '::root/components/shared-components/react/error-boundary';
import { Tree } from './components/tree/tree';
import { Route } from 'react-router-dom';
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
import { getCurrentDocument } from '::store/selectors/cache/document/document';

const mapState = (state: Store) => {
  const document = getCurrentDocument(state);
  return {
    documentId: document?.id,
    updatedAt: document?.updatedAt,
    localUpdatedAt: document?.state?.localUpdatedAt,
    nodes: document?.nodes,
    fetchNodesStarted: state.document.fetchNodesStarted,
    saveInProgress: state.document.saveInProgress,
    selectedNode_id: document.state?.selectedNode_id,
    recentNodes: document.state?.recentNodes,
    showTree: state.editor.showTree,
    showRecentNodesBar: state.editor.showRecentNodesBar,
  };
};

const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};

const Document: React.FC<Props & PropsFromRedux> = ({
  updatedAt,
  localUpdatedAt,
  nodes,
  fetchNodesStarted,
  saveInProgress,
  selectedNode_id,
  recentNodes,
  showTree,
  showRecentNodesBar,
  documentId,
}) => {
  const [documentState, dispatch] = useReducer(
    documentReducer,
    documentInitialState,
  );
  useEffect(() => {
    documentActionCreators.setDispatch(dispatch);
  }, []);

  useTrackDocumentChanges({ updatedAt, localUpdatedAt });

  return (
    <DocumentContext.Provider value={documentState}>
      <LinearProgress
        loading={Boolean(fetchNodesStarted) || saveInProgress !== 'idle'}
      />
      {nodes && (
        <Fragment>
          {Boolean(selectedNode_id) && (
            <RecentNodes
              showRecentNodes={showRecentNodesBar}
              file_id={documentId}
              recentNodes={recentNodes}
              selectedNode_id={selectedNode_id}
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

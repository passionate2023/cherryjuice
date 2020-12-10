import * as React from 'react';
import { Fragment } from 'react';
import { ErrorBoundary } from '::root/components/shared-components/react/error-boundary';
import { Tree } from './components/tree/tree';
import { Route } from 'react-router-dom';
import { LinearProgress } from '::root/components/shared-components/loading-indicator/linear-progress';
import { EditorContainer } from '::root/components/app/components/editor/document/components/editor-container/editor-container';
import { Store } from '::store/store';
import { connect, ConnectedProps } from 'react-redux';
import { getCurrentDocument } from '::store/selectors/cache/document/document';
import { TabsContainer } from '::root/components/app/components/editor/document/components/title-and-recent-nodes/tabs-container';
import { NodePath } from '::root/components/app/components/editor/document/components/node-path/node-path';

const mapState = (state: Store) => {
  const document = getCurrentDocument(state);
  return {
    nodes: document?.nodes,
    selectedNode_id: document?.persistedState?.selectedNode_id,
    fetchDocumentInProgress:
      state.document.asyncOperations.fetch === 'in-progress',
    saveInProgress: state.document.asyncOperations.save === 'in-progress',
    showTree: state.editor.showTree,
    showNodePath: state.editor.showNodePath,
    isOnMd: state.root.isOnMd,
  };
};

const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};

const Document: React.FC<Props & PropsFromRedux> = ({
  nodes,
  fetchDocumentInProgress,
  saveInProgress,
  selectedNode_id,
  showTree,
  showNodePath,
  isOnMd,
}) => {
  return (
    <>
      <LinearProgress loading={fetchDocumentInProgress || saveInProgress} />
      {nodes && (
        <Fragment>
          {(showNodePath || !isOnMd) && Boolean(selectedNode_id) && (
            <ErrorBoundary>
              <NodePath />
            </ErrorBoundary>
          )}
          {Boolean(selectedNode_id) && <TabsContainer />}
          {showTree && (
            <ErrorBoundary>
              <Tree />
            </ErrorBoundary>
          )}

          <Route
            exact
            path={`/document/:file_id/node/:node_id/`}
            render={() => <EditorContainer node={nodes[selectedNode_id]} />}
          />
        </Fragment>
      )}
    </>
  );
};

export default connector(Document);

import * as React from 'react';
import { Fragment, Suspense } from 'react';
import { ErrorBoundary } from '::root/components/shared-components/react/error-boundary';
import { Tree } from './components/tree/tree';
import { Route } from 'react-router-dom';
import { EditorContainer } from '::root/components/app/components/editor/document/components/editor-container/editor-container';
import { Store } from '::store/store';
import { connect, ConnectedProps } from 'react-redux';
import { getCurrentDocument } from '::store/selectors/cache/document/document';
import { NodePath } from '::root/components/app/components/editor/document/components/node-path/node-path';
import { Void } from '::shared-components/react/void';
import { useCurrentBreakpoint } from '@cherryjuice/shared-helpers';
const ToolBar = React.lazy(() =>
  import('::app/components/editor/editor-toolbar/editor-toolbar'),
);
const mapState = (state: Store) => {
  const document = getCurrentDocument(state);
  return {
    nodes: document?.nodes,
    selectedNode_id: document?.persistedState?.selectedNode_id,

    showTree: state.editor.showTree,
    showNodePath: state.editor.showNodePath,
  };
};

const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;

const Document: React.FC<PropsFromRedux> = ({
  nodes,
  selectedNode_id,
  showTree,
  showNodePath,
}) => {
  const { mbOrTb } = useCurrentBreakpoint();
  return (
    <>
      <ErrorBoundary>
        <Suspense fallback={<Void />}>
          <ToolBar />
        </Suspense>
      </ErrorBoundary>
      {nodes && (
        <Fragment>
          {(showNodePath || !mbOrTb) && Boolean(selectedNode_id) && (
            <ErrorBoundary>
              <NodePath />
            </ErrorBoundary>
          )}

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

import * as React from 'react';
import { Suspense, useEffect } from 'react';
import { ErrorBoundary } from '::root/components/shared-components/react/error-boundary';
import { Tree } from './components/tree/tree';
import { EditorContainer } from '::root/components/app/components/editor/document/components/editor-container/editor-container';
import { Store } from '::store/store';
import { connect, ConnectedProps } from 'react-redux';
import { getCurrentDocument } from '::store/selectors/cache/document/document';
import { NodePath } from '::root/components/app/components/editor/document/components/node-path/node-path';
import { Void } from '::shared-components/react/void';
import { useCurrentBreakpoint } from '@cherryjuice/shared-helpers';
import { TreeResizeHandler } from '::app/components/editor/document/components/tree/helpers/tree-resize-handler/tree-resize-handler';
import { Route } from 'react-router-dom';
const ToolBar = React.lazy(() =>
  import('::app/components/editor/editor-toolbar/editor-toolbar'),
);
const mapState = (state: Store) => {
  const document = getCurrentDocument(state);
  return {
    selectedNode_id: document?.persistedState?.selectedNode_id,
    showTree: state.editor.showTree,
    showNodePath: state.editor.showNodePath,
  };
};

const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;
export const treeResizeHandler = new TreeResizeHandler();
const Document: React.FC<PropsFromRedux> = ({
  selectedNode_id,
  showTree,
  showNodePath,
}) => {
  const { mbOrTb } = useCurrentBreakpoint();
  useEffect(() => {
    treeResizeHandler.onTreeVisibilityChange(showTree);
  }, [showTree]);
  return (
    <>
      <ErrorBoundary>
        <Suspense fallback={<Void />}>
          <ToolBar />
        </Suspense>
      </ErrorBoundary>
      {(showNodePath || !mbOrTb) && Boolean(selectedNode_id) && (
        <ErrorBoundary>
          <NodePath />
        </ErrorBoundary>
      )}
      <ErrorBoundary>
        <Tree />
      </ErrorBoundary>
      <ErrorBoundary>
        <Route
          exact
          path={`/document/:file_id/node/:node_id/`}
          component={EditorContainer}
        />
      </ErrorBoundary>
    </>
  );
};

export default connector(Document);

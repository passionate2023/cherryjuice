import { Route, useHistory } from 'react-router-dom';
import { Suspense } from 'react';
import * as React from 'react';
import { Void } from '::shared-components/suspense-fallback/void';
import { ErrorBoundary } from '::shared-components/error-boundary';
import { TState } from '::app/reducer';

const Document = React.lazy(() => import('::app/editor/document'));
const InfoBar = React.lazy(() => import('::app/editor/info-bar'));
const ToolBar = React.lazy(() => import('::app/editor/tool-bar'));
import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::root/store';

const mapState = (state: Store) => ({
  documentId: state.document.documentId,
});
const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;

const Editor: React.FC<{ state: TState } & PropsFromRedux> = ({
  state,
  documentId,
}) => {
  const history = useHistory();
  return (
    <>
      <ErrorBoundary>
        <Suspense fallback={<Void />}>
          <ToolBar
            showFormattingButtons={state.showFormattingButtons}
            contentEditable={state.contentEditable}
            isOnMobile={state.isOnMobile}
            showInfoBar={state.showInfoBar}
            showRecentNodes={state.showRecentNodes}
            showTree={state.showTree}
            selectedNodeId={state.selectedNode?.nodeId}
            documentHasUnsavedChanges={state.documentHasUnsavedChanges}
          />
        </Suspense>
      </ErrorBoundary>
      {!documentId && history.location.pathname === '/' ? (
        <p>No selected document</p>
      ) : (
        <Route
          path={`/document/:file_id?/`}
          render={() => (
            <Suspense fallback={<Void />}>
              <Document state={state} />
            </Suspense>
          )}
        />
      )}

      <Suspense fallback={<Void />}>
        <InfoBar state={state} node={state.selectedNode} />
      </Suspense>
    </>
  );
};
export default connector(Editor);

import { Route } from 'react-router-dom';
import { Suspense, useEffect } from 'react';
import * as React from 'react';
import { Void } from '::shared-components/suspense-fallback/void';
import { ErrorBoundary } from '::shared-components/error-boundary';
import { TState, appActionCreators } from '::app/reducer';

const Document = React.lazy(() => import('::app/editor/document'));
const InfoBar = React.lazy(() => import('::app/editor/info-bar/info-bar'));
const ToolBar = React.lazy(() => import('::app/editor/tool-bar'));
import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::root/store/store';
import { router } from '::root/router/router';

const mapState = (state: Store) => ({
  documentId: state.document.documentId,
});
const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;

const Editor: React.FC<{ state: TState } & PropsFromRedux> = ({
  state,
  documentId,
}) => {
  useEffect(() => {
    if (!documentId && router.location.pathname === '/')
      appActionCreators.showFileSelect();
  }, [documentId, router.location.pathname]);
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
            documentHasUnsavedChanges={state.documentHasUnsavedChanges}
          />
        </Suspense>
      </ErrorBoundary>
      {!documentId && router.location.pathname === '/' ? (
        <></>
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
        <InfoBar state={state} />
      </Suspense>
    </>
  );
};
export default connector(Editor);

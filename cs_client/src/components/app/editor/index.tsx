import { Route } from 'react-router-dom';
import { Suspense, useEffect } from 'react';
import * as React from 'react';
import { Void } from '::shared-components/suspense-fallback/void';
import { ErrorBoundary } from '::shared-components/error-boundary';
import { connect, ConnectedProps } from 'react-redux';
import { Store, ac } from '::root/store/store';
import { router } from '::root/router/router';
const Document = React.lazy(() => import('::app/editor/document'));
const InfoBar = React.lazy(() => import('::app/editor/info-bar/info-bar'));
const ToolBar = React.lazy(() => import('::app/editor/tool-bar'));

const mapState = (state: Store) => ({
  documentId: state.document.documentId,
  alert: state.dialogs.alert,
  isOnMobile: state.root.isOnMobile,
});
const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;

const Editor: React.FC<PropsFromRedux> = ({ documentId, alert }) => {
  useEffect(() => {
    if (!alert && !documentId && router.location.pathname === '/')
      ac.dialogs.showDocumentList();
  }, [documentId, router.location.pathname, alert]);

  return (
    <>
      <ErrorBoundary>
        <Suspense fallback={<Void />}>
          <ToolBar />
        </Suspense>
      </ErrorBoundary>
      {!documentId && router.location.pathname === '/' ? (
        <></>
      ) : (
        <Route
          path={`/document/:file_id?/`}
          render={() => (
            <Suspense fallback={<Void />}>
              <Document />
            </Suspense>
          )}
        />
      )}

      <Suspense fallback={<Void />}>
        <InfoBar />
      </Suspense>
    </>
  );
};
export default connector(Editor);

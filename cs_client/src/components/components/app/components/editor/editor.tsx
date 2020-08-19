import { Route } from 'react-router-dom';
import { Suspense, useEffect } from 'react';
import * as React from 'react';
import { Void } from '::root/components/shared-components/react/void';
import { ErrorBoundary } from '::root/components/shared-components/react/error-boundary';
import { connect, ConnectedProps } from 'react-redux';
import { Store, ac } from '::store/store';
import { router } from '::root/router/router';
import { getCurrentDocument } from '::store/selectors/cache/document/document';
const Document = React.lazy(() =>
  import('::root/components/app/components/editor/document/document'),
);
const InfoBar = React.lazy(() =>
  import('::root/components/app/components/editor/info-bar/info-bar'),
);
const ToolBar = React.lazy(() =>
  import('::root/components/app/components/editor/tool-bar/tool-bar'),
);

const mapState = (state: Store) => ({
  documentId: state.document.documentId,
  document: getCurrentDocument(state),
  alert: state.dialogs.alert,
  isOnMobile: state.root.isOnMobile,
});
const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;

const Editor: React.FC<PropsFromRedux> = ({ documentId, alert, document }) => {
  useEffect(() => {
    if (!alert && !documentId && router.get.location.pathname === '/')
      ac.dialogs.showDocumentList();
  }, [documentId, router.get.location.pathname, alert]);
  const params = /\/document\/([^/]*)\//.exec(location.pathname);
  const file_id = params && params[1];
  useEffect(() => {
    if (file_id !== documentId) ac.document.setDocumentId(file_id);
  }, [file_id]);
  return (
    <>
      <ErrorBoundary>
        <Suspense fallback={<Void />}>
          <ToolBar />
        </Suspense>
      </ErrorBoundary>
      {document?.nodes && document.nodes[0] && (
        <>
          {!documentId && router.get.location.pathname === '/' ? (
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
        </>
      )}
      <Suspense fallback={<Void />}>
        <InfoBar />
      </Suspense>
    </>
  );
};
export default connector(Editor);

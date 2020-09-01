import { Route } from 'react-router-dom';
import { Suspense } from 'react';
import * as React from 'react';
import { Void } from '::root/components/shared-components/react/void';
import { ErrorBoundary } from '::root/components/shared-components/react/error-boundary';
import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::store/store';
import { router } from '::root/router/router';
import { getCurrentDocument } from '::store/selectors/cache/document/document';
import { useDocumentRouting } from '::root/components/app/components/editor/hooks/document-routing/document-routing';

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
  isOnMobile: state.root.isOnMd,
  docking: state.root.docking,
  document: getCurrentDocument(state),
});
const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;

const Editor: React.FC<PropsFromRedux> = ({
  document,
  documentId: currentDocumentId,
  docking,
}) => {
  useDocumentRouting(document, currentDocumentId);

  return (
    <>
      <ErrorBoundary>
        <Suspense fallback={<Void />}>
          <ToolBar />
        </Suspense>
      </ErrorBoundary>
      {document?.nodes && document.nodes[0] && (
        <>
          {!currentDocumentId && router.get.location.pathname === '/' ? (
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
      <Suspense fallback={<Void />}>{!docking && <InfoBar />}</Suspense>
    </>
  );
};
export default connector(Editor);

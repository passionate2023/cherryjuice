import { Route } from 'react-router-dom';
import { Suspense } from 'react';
import * as React from 'react';
import { Void } from '::root/components/shared-components/react/void';
import { ErrorBoundary } from '::root/components/shared-components/react/error-boundary';
import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::store/store';
import { router } from '::root/router/router';
import {
  getCurrentDocument,
  getDocumentsList,
} from '::store/selectors/cache/document/document';
import { useDocumentRouting } from '::root/components/app/components/editor/hooks/document-routing';
import { useTrackDocumentChanges } from '::root/components/app/components/editor/document/hooks/track-document-changes';
import { documentHasUnsavedChanges } from '::root/components/app/components/menus/dialogs/documents-list/components/documents-list/components/document/document';
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
  isOnMobile: state.root.isOnMobile,
  userHasUnsavedChanges: getDocumentsList(state).some(
    documentHasUnsavedChanges,
  ),
});
const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;

const Editor: React.FC<PropsFromRedux> = ({
  document,
  documentId: currentDocumentId,
  userHasUnsavedChanges,
}) => {
  useDocumentRouting(document, currentDocumentId);
  useTrackDocumentChanges({
    userHasUnsavedChanges,
    documentName: document?.name,
  });
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
      <Suspense fallback={<Void />}>
        <InfoBar />
      </Suspense>
    </>
  );
};
export default connector(Editor);

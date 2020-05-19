import * as React from 'react';
import { Suspense } from 'react';
import { Void } from '::shared-components/suspense-fallback/void';
import { appActionCreators, TState } from '::app/reducer';
import { AuthUser } from '::types/graphql/generated';
import ReloadDocument from '::app/menus/modals/reload-document/reload-document';
import { Snackbar } from '::shared-components/snackbar/snackbar';
const AlertModal = React.lazy(() => import('./modals/alert-modal/alert-modal'));
const UserPopup = React.lazy(() => import('./user/user'));
const ImportProgress = React.lazy(() =>
  import('./import-progress/import-progress'),
);
const ImportDocuments = React.lazy(() =>
  import('./import-documents/import-documents'),
);
const Settings = React.lazy(() => import('::app/menus/settings'));
const SelectFile = React.lazy(() => import('::app/menus/select-file'));
const NodeMeta = React.lazy(() => import('::app/menus/node-meta/node-meta'));
const DocumentMeta = React.lazy(() =>
  import('::app/menus/document-meta/document-meta'),
);
const DeleteNode = React.lazy(() =>
  import('::app/menus/modals/delete-node/delete-node'),
);
type Props = { state: TState; dispatch: any; session: AuthUser };

const Menus: React.FC<Props> = ({ state, dispatch, session: { user } }) => {
  return (
    <>
      <Suspense fallback={<Void />}>
        <SelectFile
          selectedFile={state.selectedFile}
          reloadFiles={state.reloadFiles}
          showDialog={state.showFileSelect}
          isOnMobile={state.isOnMobile}
        />
      </Suspense>
      <Suspense fallback={<Void />}>
        <Settings
          dispatch={dispatch}
          showDialog={state.showSettings}
          isOnMobile={state.isOnMobile}
        />
      </Suspense>
      <Suspense fallback={<Void />}>
        <AlertModal
          alert={state.alert}
          show={Boolean(state.alert)}
          onClose={appActionCreators.clearAlert}
        />
      </Suspense>
      <Suspense fallback={<Void />}>
        <ImportDocuments
          show={Boolean(state.showImportDocuments)}
          onClose={appActionCreators.toggleShowImportDocuments}
        />
      </Suspense>
      <Suspense fallback={<Void />}>
        <UserPopup
          {...user}
          onClose={appActionCreators.toggleUserPopup}
          show={state.showUserPopup}
        />
      </Suspense>
      <Suspense fallback={<Void />}>
        <ImportProgress />
      </Suspense>
      <Suspense fallback={<Void />}>
        <NodeMeta
          showDialog={state.showNodeMeta}
          isOnMobile={state.isOnMobile}
          onClose={appActionCreators.hideNodeMeta}
          nodeId={
            state.selectedNode ? state.selectedNode.nodeId : state.rootNode?.id
          }
        />
      </Suspense>
      <Suspense fallback={<Void />}>
        <DocumentMeta
          showDialog={state.showDocumentMetaDialog}
          isOnMobile={state.isOnMobile}
          onClose={appActionCreators.hideDocumentMetaDialog}
        />
      </Suspense>
      <Suspense fallback={<Void />}>
        <DeleteNode
          onClose={appActionCreators.toggleDeleteDocumentModal}
          show={state.showDeleteDocumentModal}
          nodeId={state.selectedNode?.nodeId}
        />
      </Suspense>
      <Suspense fallback={<Void />}>
        <ReloadDocument
          onClose={appActionCreators.hideReloadConfirmationModal}
          show={state.showReloadConfirmationModal}
        />
      </Suspense>
      <Suspense fallback={<Void />}>
        <Snackbar
          onClose={appActionCreators.clearSnackbarMessage}
          message={state.snackbarMessage}
        />
      </Suspense>
    </>
  );
};

export default Menus;

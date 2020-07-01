import * as React from 'react';
import { Suspense } from 'react';
import { Void } from '::shared-components/suspense-fallback/void';
import { appActionCreators, TState } from '::app/reducer';
import { AuthUser } from '::types/graphql/generated';
import ReloadDocument from '::app/menus/modals/reload-document/reload-document';
import { Snackbar } from '::shared-components/snackbar/snackbar';
import { ac } from '::root/store/store';
const AlertModal = React.lazy(() => import('./modals/alert-modal/alert-modal'));
const UserPopup = React.lazy(() => import('./user/user'));
const ImportProgress = React.lazy(() =>
  import('./document-operations/document-operations'),
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

import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::root/store/store';

const mapState = (state: Store) => ({
  showImportDocuments: state.dialogs.showImportDocuments,
  showDocumentList: state.dialogs.showDocumentList,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

const Menus: React.FC<Props & PropsFromRedux> = ({
  state,
  dispatch,
  session: { user },
  showImportDocuments,
}) => {
  return (
    <>
      <Suspense fallback={<Void />}>
        <SelectFile isOnMobile={state.isOnMobile} />
      </Suspense>
      <Suspense fallback={<Void />}>
        <Settings
          dispatch={dispatch}
          showDialog={state.showSettings}
          isOnMobile={state.isOnMobile}
        />
      </Suspense>
      <Suspense fallback={<Void />}>
        <AlertModal />
      </Suspense>
      <Suspense fallback={<Void />}>
        <ImportDocuments
          show={showImportDocuments}
          onClose={ac.dialogs.hideImportDocument}
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
        />
      </Suspense>
      <Suspense fallback={<Void />}>
        <DocumentMeta isOnMobile={state.isOnMobile} />
      </Suspense>
      <Suspense fallback={<Void />}>
        <DeleteNode
          onClose={appActionCreators.toggleDeleteDocumentModal}
          show={state.showDeleteDocumentModal}
        />
      </Suspense>
      <Suspense fallback={<Void />}>
        <ReloadDocument />
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
const _ = connector(Menus);
export default _;

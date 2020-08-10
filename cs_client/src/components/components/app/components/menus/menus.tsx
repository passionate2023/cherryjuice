import * as React from 'react';
import { Suspense } from 'react';
import { Void } from '::root/components/shared-components/react/void';
import ReloadDocument from '::root/components/app/components/menus/modals/reload-document/reload-document';
import { Snackbar } from '::root/components/shared-components/snackbar/snackbar';
const AlertModal = React.lazy(() => import('./modals/alert-modal/alert-modal'));
const PasswordModal = React.lazy(() =>
  import('./modals/password-modal/password-modal'),
);
const UserPopup = React.lazy(() =>
  import('./modals/user/user-with-transition'),
);
const ImportProgress = React.lazy(() =>
  import('./widgets/document-operations/document-operations'),
);
const ImportDocuments = React.lazy(() =>
  import('./modals/import-documents/import-documents'),
);
const Settings = React.lazy(() =>
  import('::root/components/app/components/menus/dialogs/settings/settings'),
);
const DocumentsList = React.lazy(() =>
  import(
    '::root/components/app/components/menus/dialogs/documents-list/documents-list'
  ),
);
const NodeMeta = React.lazy(() =>
  import('::root/components/app/components/menus/dialogs/node-meta/node-meta'),
);
const DocumentMeta = React.lazy(() =>
  import(
    '::root/components/app/components/menus/dialogs/document-meta/document-meta'
  ),
);
const DeleteNode = React.lazy(() =>
  import(
    '::root/components/app/components/menus/modals/delete-node/delete-node'
  ),
);

import { connect, ConnectedProps } from 'react-redux';
import { SearchDialog } from '::root/components/app/components/menus/dialogs/search-dialog/search-dialog';

const mapState = () => ({});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};
const Menus: React.FC<Props & PropsFromRedux> = () => {
  return (
    <>
      <Suspense fallback={<Void />}>
        <DocumentsList />
      </Suspense>
      <Suspense fallback={<Void />}>
        <Settings />
      </Suspense>
      <Suspense fallback={<Void />}>
        <AlertModal />
      </Suspense>
      <Suspense fallback={<Void />}>
        <ImportDocuments />
      </Suspense>
      <Suspense fallback={<Void />}>
        <UserPopup />
      </Suspense>
      <Suspense fallback={<Void />}>
        <ImportProgress />
      </Suspense>
      <Suspense fallback={<Void />}>
        <NodeMeta />
      </Suspense>
      <Suspense fallback={<Void />}>
        <DocumentMeta />
      </Suspense>
      <Suspense fallback={<Void />}>
        <DeleteNode />
      </Suspense>
      <Suspense fallback={<Void />}>
        <ReloadDocument />
      </Suspense>
      <Suspense fallback={<Void />}>
        <Snackbar />
      </Suspense>
      <Suspense fallback={<Void />}>
        <PasswordModal />
      </Suspense>
      <SearchDialog />
    </>
  );
};
const _ = connector(Menus);
export default _;

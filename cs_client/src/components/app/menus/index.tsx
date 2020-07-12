import * as React from 'react';
import { Suspense } from 'react';
import { Void } from '::shared-components/suspense-fallback/void';
import ReloadDocument from '::app/menus/modals/reload-document/reload-document';
import { Snackbar } from '::shared-components/snackbar/snackbar';
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

import { connect, ConnectedProps } from 'react-redux';
import { SearchDialog } from '::app/menus/dialogs/search-dialog/search-dialog';

const mapState = () => ({});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};
const Menus: React.FC<Props & PropsFromRedux> = () => {
  return (
    <>
      <Suspense fallback={<Void />}>
        <SelectFile />
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
      <SearchDialog />
    </>
  );
};
const _ = connector(Menus);
export default _;

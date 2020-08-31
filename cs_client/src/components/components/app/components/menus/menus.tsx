import * as React from 'react';
import { Suspense } from 'react';
import { Void } from '::root/components/shared-components/react/void';
import ReloadDocument from '::root/components/app/components/menus/modals/reload-document/reload-document';
const AlertModal = React.lazy(() => import('./modals/alert-modal/alert-modal'));
const PasswordModal = React.lazy(() =>
  import('./modals/password-modal/password-modal'),
);
const UserPopup = React.lazy(() =>
  import('./modals/user/user-with-transition'),
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
import { ErrorBoundary } from '::root/components/shared-components/react/error-boundary';
import { Widgets } from '::root/components/app/components/menus/widgets/widgets';

const components = [
  <UserPopup key={'UserPopup'} />,
  <DocumentsList key={'DocumentsList'} />,
  <Settings key={'Settings'} />,
  <SearchDialog key={'PasswordModal'} />,
  <DocumentMeta key={'DocumentMeta'} />,
  <NodeMeta key={'NodeMeta'} />,
  <ImportDocuments key={'ImportDocuments'} />,
  <ReloadDocument key={'ReloadDocument'} />,
  <DeleteNode key={'DeleteNode'} />,
  // @ts-ignore
  <PasswordModal key={'PasswordModal'} />,
  <AlertModal key={'AlertModal'} />,
  <Widgets key={'Widgets'} />,
];
const mapState = () => ({});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};
const Menus: React.FC<Props & PropsFromRedux> = () => {
  return (
    <>
      {components.map((component, i) => (
        <ErrorBoundary key={i}>
          <Suspense fallback={<Void />}>{component}</Suspense>
        </ErrorBoundary>
      ))}
    </>
  );
};
const _ = connector(Menus);
export default _;

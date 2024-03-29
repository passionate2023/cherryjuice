import * as React from 'react';
import { Suspense } from 'react';
import { Void } from '::root/components/shared-components/react/void';
import { connect, ConnectedProps } from 'react-redux';
import { ErrorBoundary } from '::root/components/shared-components/react/error-boundary';

const SearchDialog = React.lazy(() =>
  import(
    '::root/components/app/components/menus/dialogs/search-dialog/search-dialog'
  ),
);
const AlertModal = React.lazy(() => import('./modals/alert-modal/alert-modal'));
const Widgets = React.lazy(() =>
  import('::root/components/app/components/menus/widgets/widgets'),
);
const ReloadDocument = React.lazy(() =>
  import(
    '::root/components/app/components/menus/modals/reload-document/reload-document'
  ),
);
const PasswordModal = React.lazy(() =>
  import('./modals/password-modal/password-modal'),
);

const Anchor = React.lazy(() => import('./dialogs/anchor/anchor'));
const Bookmarks = React.lazy(() =>
  import('./dialogs/bookmarks/bookmarks-dialog'),
);
const Link = React.lazy(() => import('./dialogs/link/link'));
const Codebox = React.lazy(() => import('./dialogs/codebox/codebox'));
const Table = React.lazy(() => import('./dialogs/table/table'));
const ImportDocuments = React.lazy(() =>
  import('./modals/import-documents/import-documents'),
);
const Settings = React.lazy(() =>
  import('::root/components/app/components/menus/dialogs/settings/settings'),
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
const DeleteDocument = React.lazy(() =>
  import(
    '::root/components/app/components/menus/modals/delete-document/delete-document'
  ),
);

const components = [
  <Bookmarks key={'Bookmarks'} />,
  <Settings key={'Settings'} />,
  <SearchDialog key={'SearchDialog'} />,
  <DocumentMeta key={'DocumentMeta'} />,
  <NodeMeta key={'NodeMeta'} />,
  <ImportDocuments key={'ImportDocuments'} />,
  <ReloadDocument key={'ReloadDocument'} />,
  <DeleteDocument key={'DeleteDocument'} />,
  <DeleteNode key={'DeleteNode'} />,
  // @ts-ignore
  <PasswordModal key={'PasswordModal'} />,
  <AlertModal key={'AlertModal'} />,
  <Widgets key={'Widgets'} />,
  <Anchor key={'Anchor'} />,
  <Link key={'Link'} />,
  <Codebox key={'Codebox'} />,
  <Table key={'Table'} />,
];
const mapState = () => ({});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = Record<string, never>;
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

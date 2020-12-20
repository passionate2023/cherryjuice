import * as React from 'react';
import { Suspense } from 'react';
import { Void } from '::root/components/shared-components/react/void';
import { modApp } from '::sass-modules';
import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::store/store';
import { joinClassNames } from '::helpers/dom/join-class-names';
import { Empty } from '::app/components/empty/empty';

const Menus = React.lazy(() =>
  import('::root/components/app/components/menus/menus'),
);
const Editor = React.lazy(() =>
  import('::root/components/app/components/editor/editor'),
);

type Props = {};

const mapState = (state: Store) => ({
  dockedDialog: state.root.dockedDialog,
  userId: state.auth.user?.id,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

const App: React.FC<Props & PropsFromRedux> = ({ dockedDialog }) => {
  // useRefreshToken({ token });
  return (
    <div
      className={joinClassNames([
        modApp.app,
        [modApp.appDialogDocked, dockedDialog],
      ])}
    >
      <Suspense fallback={<Void />}>
        <Editor />
      </Suspense>
      <Suspense fallback={<Void />}>
        <Menus />
      </Suspense>
      <Empty />
    </div>
  );
};
const _ = connector(App);
export { _ as App };

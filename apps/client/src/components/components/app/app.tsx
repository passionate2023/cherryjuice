import * as React from 'react';
import { Suspense } from 'react';
import { Void } from '::root/components/shared-components/react/void';
import { modApp } from '::sass-modules';
import { connect, ConnectedProps } from 'react-redux';
import { joinClassNames } from '@cherryjuice/shared-helpers';
import { Empty } from '::app/components/empty/empty';

import { Toolbar } from '::app/components/toolbar/toolbar';
import { Store } from '::store/store';
import { aDialogIsPinned } from '::store/selectors/layout/a-dialog-is-pinned';
import { HomeSkeleton } from '::app/components/home/home-skeleton';

const Menus = React.lazy(() =>
  import('::root/components/app/components/menus/menus'),
);
const Editor = React.lazy(() =>
  import('::root/components/app/components/editor/editor'),
);
const Home = React.lazy(() =>
  import('::root/components/app/components/home/home'),
);

const mapState = (state: Store) => ({
  isAuthenticated: !!state.auth.user?.id,
  dockedDialog: aDialogIsPinned(state),
  showHome: state.home.show,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

const App: React.FC<PropsFromRedux> = ({
  isAuthenticated,
  dockedDialog,
  showHome,
}) => {
  // useRefreshToken({ token });
  return (
    <div
      className={joinClassNames([
        modApp.app,
        dockedDialog && modApp.appDialogDocked,
      ])}
    >
      <Toolbar />
      {isAuthenticated && showHome && (
        <Suspense fallback={<HomeSkeleton />}>
          <Home />
        </Suspense>
      )}
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

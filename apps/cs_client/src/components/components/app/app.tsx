import * as React from 'react';
import { Suspense } from 'react';
import { Void } from '::root/components/shared-components/react/void';
import { modApp } from '::sass-modules';
import { connect, ConnectedProps } from 'react-redux';
import { joinClassNames } from '@cherryjuice/shared-helpers';
import { Empty } from '::app/components/empty/empty';

import { Tabs } from '::app/components/tabs/tabs';
import { Store } from '::store/store';
import { Route } from 'react-router-dom';

const Menus = React.lazy(() =>
  import('::root/components/app/components/menus/menus'),
);
const Editor = React.lazy(() =>
  import('::root/components/app/components/editor/editor'),
);
const Home = React.lazy(() =>
  import('::root/components/app/components/home/home'),
);

type Props = Record<string, never>;

const mapState = (state: Store) => ({
  isAuthenticated: !!state.auth.user?.id,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

const App: React.FC<Props & PropsFromRedux> = ({ isAuthenticated }) => {
  // useRefreshToken({ token });
  return (
    <div
      className={joinClassNames([
        modApp.app,
        // [modApp.appDialogDocked, dockedDialog],
      ])}
    >
      <Tabs />
      <Route
        path={`/documents/:folder?/`}
        render={() => {
          return (
            isAuthenticated && (
              <Suspense fallback={<Void style={'blockBackgroundFullSize'} />}>
                <Home />
              </Suspense>
            )
          );
        }}
      />
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

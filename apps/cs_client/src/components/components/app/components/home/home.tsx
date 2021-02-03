import * as React from 'react';
import mod from './home.scss';
import { Folder } from '::app/components/home/components/folder/folder';
import { Sidebar } from '::app/components/home/components/sidebar/sidebar';
import { ac, Store } from '::store/store';
import { connect, ConnectedProps } from 'react-redux';
import { useEffect, useMemo } from 'react';
import { createGesturesHandler } from '@cherryjuice/shared-helpers';

const mapState = (state: Store) => ({
  showSidebar: state.home.showSidebar,
  isOnMd: state.root.isOnTb,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = Record<string, never>;

const Home: React.FC<Props & PropsFromRedux> = ({ showSidebar, isOnMd }) => {
  const { onTouchEnd, onTouchStart } = useMemo(
    () =>
      createGesturesHandler({
        onRight: ac.home.toggleSidebar,
        onLeft: ac.home.toggleSidebar,
      }),
    [],
  );
  useEffect(() => {
    ac.home.fetchFolders();
  }, []);
  return (
    <div
      className={mod.home}
      onTouchEnd={onTouchEnd}
      onTouchStart={onTouchStart}
    >
      <div
        className={mod.mod__sidebarAndFolder}
        data-show-sidebar={showSidebar}
      >
        {(!isOnMd || showSidebar) && <Sidebar />}
        <Folder />
      </div>
    </div>
  );
};
export default connector(Home);
export { mod as modHome };

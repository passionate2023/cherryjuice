import modDrawer from '::sass-modules/shared-components/drawer.scss';
import * as React from 'react';
import { useCallback } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::root/store/store';
import { AlertType } from '::types/react';

const mapState = (state: Store) => ({
  selectedScreenTitle: state.settings.selectedScreen,
  screenHasChanges: state.settings.screenHasChanges,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type DrawerNavigationElementProps = {
  title: string;
};

const DrawerNavigationElement: React.FC<DrawerNavigationElementProps &
  PropsFromRedux> = ({ title, selectedScreenTitle, screenHasChanges }) => {
  const isSelected = selectedScreenTitle === title;
  const onClick = useCallback(() => {
    if (screenHasChanges) {
      ac.dialogs.setAlert({
        type: AlertType.Warning,
        title: 'apply changes',
        description: `${selectedScreenTitle} has unsaved changes`,
        action: {
          name: 'save',
          callbacks: [
            () => {
              ac.settings.save(title);
            },
            ac.dialogs.clearAlert,
          ],
        },
        dismissAction: {
          name: 'discard',
          callbacks: [() => ac.settings.selectScreen(title)],
        },
      });
    } else ac.settings.selectScreen(title);
  }, [screenHasChanges]);
  return (
    <span
      className={`${modDrawer.drawer__navigation__element} ${
        isSelected ? modDrawer.drawer__navigation__elementActive : ''
      }`}
      onClick={onClick}
    >
      <span> {title}</span>
    </span>
  );
};

const _ = connector(DrawerNavigationElement);
export { _ as DrawerNavigationElement };

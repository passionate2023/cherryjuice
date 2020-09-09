import modDrawer from '::sass-modules/shared-components/drawer.scss';
import * as React from 'react';
import { useCallback } from 'react';
import { connect, ConnectedProps, useSelector } from 'react-redux';
import { ac, Store } from '::store/store';
import { AlertType } from '::types/react';
import { ScreenName } from '::root/components/app/components/menus/dialogs/settings/screens/screens';

type Func = () => void;
const useUnsavedSettingsPrompt = (save: Func, discard: Func) => {
  const screenHasChanges = useSelector(
    (state: Store) => state.settings.screenHasChanges,
  );
  const selectedScreenTitle = useSelector(
    (state: Store) => state.settings.selectedScreen,
  );
  return useCallback(() => {
    if (screenHasChanges) {
      ac.dialogs.setAlert({
        type: AlertType.Warning,
        title: 'apply changes',
        description: `${selectedScreenTitle} has unsaved changes`,
        action: {
          name: 'save',
          callbacks: [save, ac.dialogs.clearAlert],
        },
        dismissAction: {
          name: 'discard',
          callbacks: [discard],
        },
      });
    } else discard();
  }, [save, discard, screenHasChanges, selectedScreenTitle]);
};

const mapState = (state: Store) => ({
  selectedScreenTitle: state.settings.selectedScreen,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type DrawerNavigationElementProps = {
  title: ScreenName;
};

const DrawerNavigationElement: React.FC<DrawerNavigationElementProps &
  PropsFromRedux> = ({ title, selectedScreenTitle }) => {
  const onClick = useUnsavedSettingsPrompt(
    () => ac.settings.save(title),
    () => ac.settings.selectScreen(title),
  );
  const isSelected = selectedScreenTitle === title;
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
export { _ as DrawerNavigationElement, useUnsavedSettingsPrompt };

import * as React from 'react';
import { DialogWithTransition } from '::root/components/shared-components/dialog';
import { Drawer } from '::root/components/shared-components/drawer/drawer';
import { screens } from '::root/components/app/components/menus/dialogs/settings/screens/screens';
import { DrawerToggle } from '::root/components/shared-components/drawer/components/drawer-toggle/drawer-toggle';
import { ErrorBoundary } from '::root/components/shared-components/react/error-boundary';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::store/store';
import { useUnsavedSettingsPrompt } from '::root/components/shared-components/drawer/components/drawer-navigation/components/drawer-navigation-element';
import { dialogHeaderButtons } from '::root/components/app/components/menus/dialogs/search-dialog/components/header-buttons/header-buttons';
import { createSelector } from 'reselect';

export const screenHasUnsavedChanges = createSelector(
  (state: Store) => !!state.editorSettings.previous,
  (state: Store) => state.settings.screenHasChanges,
  (state: Store) => !!state.settings.userProfileChanges,
  (editorScreenHashChanges, hkScreenHasChanges, userProfileChanges) => {
    return hkScreenHasChanges || editorScreenHashChanges || userProfileChanges;
  },
);

const mapState = (state: Store) => {
  const selectedScreen = state.settings.selectedScreen;
  return {
    show: state.dialogs.showSettingsDialog,
    isOnMobile: state.root.isOnMd,
    selectedScreen,
    screenHasChanges: screenHasUnsavedChanges(state),
    saveOperation: state.settings.saveOperation,
    userId: state.auth.user?.id,
    docked: state.root.dockedDialog,
  };
};

const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};

const Settings: React.FC<Props & PropsFromRedux> = ({
  show,
  userId,
  isOnMobile,
  selectedScreen,
  screenHasChanges,
  saveOperation,
  docked,
}) => {
  const savePending = saveOperation !== 'idle';
  const saveInProgress = saveOperation === 'in-progress';
  const onClose = useUnsavedSettingsPrompt(
    screenHasChanges,
    selectedScreen,
    () => ac.settings.save(),
    [ac.dialogs.hideSettingsDialog, ac.editorSettings.undoChanges],
  );
  const apply = () => ac.settings.save();
  return (
    <DialogWithTransition
      menuButton={<DrawerToggle />}
      dialogTitle={'Settings'}
      dialogFooterRightButtons={[
        { label: 'Close', onClick: onClose, disabled: false },
        {
          label: 'Apply',
          onClick: apply,
          disabled: !screenHasChanges || savePending,
        },
      ]}
      loading={saveInProgress}
      dialogFooterLeftButtons={[]}
      isOnMobile={isOnMobile}
      onClose={onClose}
      show={show && Boolean(userId)}
      docked={docked}
      rightHeaderButtons={dialogHeaderButtons({ docked })}
      measurable={true}
    >
      <ErrorBoundary>
        <Drawer screens={screens} selectedScreenTitle={selectedScreen} />
      </ErrorBoundary>
    </DialogWithTransition>
  );
};
const _ = connector(Settings);
export default _;

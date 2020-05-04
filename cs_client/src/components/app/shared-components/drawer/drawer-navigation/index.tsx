import * as React from 'react';
import { modDrawer } from '::sass-modules/index';
import { DrawerNavigationElement } from '::shared-components/drawer/drawer-navigation/drawer-navigation-element';
import {
  handleToggle,
  setupGesturesHandler,
  updateSubTitle,
} from '::shared-components/drawer/drawer-navigation/helpers';
import { useEffect } from 'react';

const DrawerNavigation: React.FC<any> = ({
  selectedScreenTitle,
  setSelectedScreenTitle,
  screens,
}) => {
  useEffect(() => {
    updateSubTitle({ selectedScreenTitle });
    setupGesturesHandler({
      onRight: handleToggle(),
      gestureZoneSelector: modDrawer.drawer,
    });
  }, [selectedScreenTitle]);
  return (
    <>
      <aside className={`${modDrawer.drawer__navigation}`}>
        <nav className={`${modDrawer.drawer__navigation__list}`}>
          {Object.keys(screens).map(title => (
            <DrawerNavigationElement
              key={title}
              title={title}
              selectedScreenTitle={selectedScreenTitle}
              setSelectedScreenTitle={setSelectedScreenTitle}
            />
          ))}
        </nav>
      </aside>
      <div
        onClick={handleToggle()}
        className={`${modDrawer.drawer__navigation__scrim}`}
      />
    </>
  );
};

export { DrawerNavigation };

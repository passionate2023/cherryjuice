import * as React from 'react';
import { modDrawer } from '::sass-modules/index';
import { DrawerNavigationElement } from '::shared-components/material/drawer/drawer-navigation/drawer-navigation-element';
import { Screens } from '::shared-components/material/tab';
import {
  handleToggle,
  setupHandleGesture,
  updateSubTitle,
} from '::shared-components/material/drawer/drawer-navigation/helpers';
import { useEffect } from 'react';

const DrawerNavigation: React.FC<Screens> = ({
  selectedScreenTitle,
  setSelectedScreenTitle,
  screens,
}) => {
  useEffect(() => {
    updateSubTitle({ selectedScreenTitle });
    setupHandleGesture({ onRight: handleToggle() });
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

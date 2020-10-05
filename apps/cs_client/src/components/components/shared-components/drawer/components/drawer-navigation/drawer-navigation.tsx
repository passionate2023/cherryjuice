import * as React from 'react';
import { modDrawer } from '::sass-modules';
import { DrawerNavigationElement } from '::root/components/shared-components/drawer/components/drawer-navigation/components/drawer-navigation-element';
import { toggleDrawer } from '::root/components/shared-components/drawer/components/drawer-toggle/helpers/create-toggle-handler';
import { DrawerScreens } from '::root/components/shared-components/drawer/drawer';
import { DrawerNavigationCategory } from '::root/components/shared-components/drawer/components/drawer-navigation/components/drawer-navigation-category';
import { groupScreensByCategory } from '::root/components/shared-components/drawer/helpers/group-screens-by-category';
import { useMemo } from 'react';
import { ScreenName } from '::root/components/app/components/menus/dialogs/settings/screens/screens';

type SelectScreen = (title: string) => void;
type DrawerNavigationProps = {
  screens: DrawerScreens;
};

const DrawerNavigation: React.FC<DrawerNavigationProps> = ({ screens }) => {
  const screensCategoriesMap = useMemo(
    () => groupScreensByCategory(screens),
    [],
  );
  return (
    <>
      <aside className={`${modDrawer.drawer__navigation}`}>
        <nav className={`${modDrawer.drawer__navigation__list}`}>
          {Object.entries(screensCategoriesMap).map(([category, screens]) => (
            <React.Fragment key={category}>
              <DrawerNavigationCategory category={category} key={category} />
              {screens.map(screen => (
                <DrawerNavigationElement
                  key={screen.name}
                  title={screen.name as ScreenName}
                />
              ))}
            </React.Fragment>
          ))}
        </nav>
      </aside>
      <div
        onClick={toggleDrawer}
        className={`${modDrawer.drawer__navigation__scrim}`}
      />
    </>
  );
};

export { DrawerNavigation };
export { SelectScreen };

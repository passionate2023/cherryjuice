import * as React from 'react';
import { modDrawer } from '::sass-modules/index';
import { DrawerNavigationElement } from '::shared-components/drawer/components/drawer-navigation/components/drawer-navigation-element';
import { toggleDrawer } from '::shared-components/drawer/components/drawer-toggle/helpers/create-toggle-handler';
import { DrawerScreens } from '::shared-components/drawer/drawer';
import { DrawerNavigationCategory } from '::shared-components/drawer/components/drawer-navigation/components/drawer-navigation-category';
import { groupScreensByCategory } from '::shared-components/drawer/helpers/group-screens-by-category';
import { useMemo } from 'react';

type SelectScreen = (title: string) => void;
type DrawerNavigationProps = {
  selectedScreenTitle: string;
  setSelectedScreenTitle: SelectScreen;
  screens: DrawerScreens;
};

const DrawerNavigation: React.FC<DrawerNavigationProps> = ({
  selectedScreenTitle,
  setSelectedScreenTitle,
  screens,
}) => {
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
                  title={screen.name}
                  selectedScreenTitle={selectedScreenTitle}
                  selectScreen={setSelectedScreenTitle}
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

import modDrawer from '::sass-modules/shared-components/drawer.scss';
import * as React from 'react';
import { useCallback } from 'react';
import { SelectScreen } from '::shared-components/drawer/components/drawer-navigation/drawer-navigation';

type DrawerNavigationElementProps = {
  title: string;
  selectedScreenTitle: string;
  selectScreen: SelectScreen;
};

const DrawerNavigationElement: React.FC<DrawerNavigationElementProps> = ({
  title,
  selectedScreenTitle,
  selectScreen,
}) => {
  const isSelected = selectedScreenTitle === title;
  const onClick = useCallback(() => selectScreen(title), []);
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

export { DrawerNavigationElement };

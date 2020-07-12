import modDrawer from '::sass-modules/shared-components/drawer.scss';
import * as React from 'react';

type DrawerNavigationCategoryProps = {
  category: string;
};

const DrawerNavigationCategory: React.FC<DrawerNavigationCategoryProps> = ({
  category,
}) => {
  return (
    <span className={`${modDrawer.drawer__navigation__category}`}>
      <span> {category}</span>
    </span>
  );
};

export { DrawerNavigationCategory };

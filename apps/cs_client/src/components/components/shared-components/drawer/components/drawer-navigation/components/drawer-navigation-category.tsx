import modDrawer from '::sass-modules/shared-components/drawer.scss';
import * as React from 'react';

type DrawerNavigationCategoryProps = {
  category: string;
};

const DrawerNavigationCategory: React.FC<DrawerNavigationCategoryProps> = ({
  category,
  children,
}) => {
  return (
    <span className={`${modDrawer.drawer__navigation__category}`}>
      <span className={`${modDrawer.drawer__navigation__category__name}`}>
        {' '}
        {category}
      </span>
      {children}
    </span>
  );
};

export { DrawerNavigationCategory };

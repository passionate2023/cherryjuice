import { DrawerScreen, DrawerScreens } from '::shared-components/drawer/drawer';

type DrawerScreensCategoriesMap = {
  [category: string]: DrawerScreen[];
};
const groupScreensByCategory = (
  screens: DrawerScreens,
): DrawerScreensCategoriesMap => {
  return Object.values(screens).reduce((acc, val) => {
    if (!acc[val.category]) acc[val.category] = [];
    acc[val.category].push(val);
    return acc;
  }, {});
};

export { groupScreensByCategory };

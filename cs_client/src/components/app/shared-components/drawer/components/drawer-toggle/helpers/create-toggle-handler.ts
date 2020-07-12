import { modDrawer } from '::sass-modules/index';

const createToggleHandler = () => {
  let drawer, drawerScrim;
  return () => {
    if (!drawer)
      drawer = document.querySelector(`.${modDrawer.drawer__navigation}`);
    if (!drawerScrim)
      drawerScrim = document.querySelector(
        `.${modDrawer.drawer__navigation__scrim}`,
      );
    drawer.classList.toggle(modDrawer.drawer__navigationVisible);
    drawerScrim.classList.toggle(modDrawer.drawer__navigation__scrimVisible);
  };
};
const toggleDrawer = createToggleHandler();
export { toggleDrawer };

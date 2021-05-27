import { modDrawer } from '::sass-modules';

const createToggleHandler = () => {
  let drawer, drawerScrim;
  return () => {
    drawer = document.querySelector(`.${modDrawer.drawer__navigation}`);
    drawerScrim = document.querySelector(
      `.${modDrawer.drawer__navigation__scrim}`,
    );
    drawer.classList.toggle(modDrawer.drawer__navigationVisible);
    drawerScrim.classList.toggle(modDrawer.drawer__navigation__scrimVisible);
  };
};
const toggleDrawer = createToggleHandler();
export { toggleDrawer };

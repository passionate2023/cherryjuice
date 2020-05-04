import { modDialog, modDrawer } from '::sass-modules/index';

const handleToggle = () => {
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
const noOpFn = () => undefined;
// https://gist.github.com/SleepWalker/da5636b1abcbaff48c4d#gistcomment-2577818
const setupGesturesHandler = ({
  gestureZoneSelector,
  onRight = noOpFn,
  onLeft = noOpFn,
  onTop = noOpFn,
  onBottom = noOpFn,
  onTap = noOpFn,
  minimumLength = 0,
}: {
  onRight?: Function;
  onLeft?: Function;
  onTop?: Function;
  onBottom?: Function;
  onTap?: Function;
  gestureZoneSelector: string;
  minimumLength?: number;
}) => {
  let pageWidth = window.innerWidth || document.body.clientWidth;
  let treshold = Math.max(1, Math.floor(0.01 * pageWidth));
  let touchstartX = 0;
  let touchstartY = 0;
  let touchendX = 0;
  let touchendY = 0;

  const limit = Math.tan(((45 * 1.5) / 180) * Math.PI);
  const gestureZone = document.querySelector(`.${gestureZoneSelector}`);
  function handleGesture() {
    let x = touchendX - touchstartX;
    let y = touchendY - touchstartY;
    let xy = Math.abs(x / y);
    let yx = Math.abs(y / x);
    if (Math.abs(x) > treshold || Math.abs(y) > treshold) {
      if (yx <= limit && Math.abs(x) > minimumLength) {
        if (x < 0) {
          onLeft();
        } else {
          onRight();
        }
      }
      if (xy <= limit && Math.abs(y) > minimumLength) {
        if (y < 0) {
          onTop();
        } else {
          onBottom();
        }
      }
    } else {
      onTap();
    }
  }

  gestureZone.addEventListener(
    'touchstart',
    function(event: TouchEvent) {
      touchstartX = event.changedTouches[0].screenX;
      touchstartY = event.changedTouches[0].screenY;
    },
    false,
  );

  gestureZone.addEventListener(
    'touchend',
    function(event: TouchEvent) {
      touchendX = event.changedTouches[0].screenX;
      touchendY = event.changedTouches[0].screenY;
      handleGesture();
    },
    false,
  );
};
const updateSubTitle = ({ selectedScreenTitle }) => {
  const subTitleElement = document.querySelector(
    '.' + modDialog.dialog__header__subTitle,
  );
  subTitleElement.innerHTML = selectedScreenTitle;
};
export { handleToggle, setupGesturesHandler, updateSubTitle };

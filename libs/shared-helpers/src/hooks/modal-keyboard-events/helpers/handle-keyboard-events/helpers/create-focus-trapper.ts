// https://hiddedevries.nl/en/blog/2017-01-29-using-javascript-to-trap-focus-in-an-element
const getFocusableElements = ({
  element,
  focusableElementsSelector,
}: Props): HTMLInputElement[] =>
  Array.from(
    element.querySelectorAll(
      // 'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])',
      (focusableElementsSelector.length
        ? focusableElementsSelector.join(', ') + ', '
        : '') +
        'button:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])',
    ),
  );

const getFirstAndLastFocusableElements = (focusableEls: HTMLInputElement[]) => {
  const firstFocusableEl = focusableEls.find(
    el => window.getComputedStyle(el).display !== 'none',
  );
  const lastFocusableEl = focusableEls
    .reverse()
    .find(el => window.getComputedStyle(el).display !== 'none');
  return [firstFocusableEl, lastFocusableEl];
};

const KEYCODE_TAB = 9;
const eventHandlerTabKey = (focusableElements: HTMLInputElement[]) => {
  const [firstFocusableEl, lastFocusableEl] = getFirstAndLastFocusableElements(
    focusableElements,
  );
  return ({ e }) => {
    const isTabPressed = e.key === 'Tab' || e.keyCode === KEYCODE_TAB;
    if (isTabPressed) {
      if (e.shiftKey) {
        /* shift + tab */
        if (document.activeElement === firstFocusableEl) {
          lastFocusableEl.focus();
          e.preventDefault();
        }
      } /* tab */ else {
        if (document.activeElement === lastFocusableEl) {
          firstFocusableEl.focus();
          e.preventDefault();
        }
      }
    }
  };
};
type Props = {
  element: HTMLElement;
  focusableElementsSelector?: string[];
};

export const createFocusTrapper = ({
  element,
  focusableElementsSelector = [],
}: Props) => {
  const focusableElements: HTMLInputElement[] = getFocusableElements({
    element,
    focusableElementsSelector,
  });

  return {
    focusableElements,
    trapFocus: eventHandlerTabKey(focusableElements),
  };
};

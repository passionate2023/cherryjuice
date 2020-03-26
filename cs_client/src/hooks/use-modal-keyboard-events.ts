import { useEffect } from 'react';

const KEYCODE_TAB = 9;
const createFocusTrapper = ({ element }) => {
  // https://hiddedevries.nl/en/blog/2017-01-29-using-javascript-to-trap-focus-in-an-element
  const focusableEls: Element[] = Array.from(
    element.querySelectorAll(
      // 'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])',
      'button:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])',
    ),
  );
  const firstFocusableEl = focusableEls.find(
    el => window.getComputedStyle(el).display !== 'none',
  );
  const lastFocusableEl = focusableEls
    .reverse()
    .find(el => window.getComputedStyle(el).display !== 'none');
  return ({ e }) => {
    const isTabPressed = e.key === 'Tab' || e.keyCode === KEYCODE_TAB;
    if (isTabPressed)
      if (e.shiftKey) {
        /* shift + tab */ if (document.activeElement === firstFocusableEl) {
          lastFocusableEl.focus();
          e.preventDefault();
        }
      } /* tab */ else {
        if (document.activeElement === lastFocusableEl) {
          firstFocusableEl.focus();
          e.preventDefault();
        }
      }
  };
};

const setupKeyboardShortcuts = ({ onCloseDialog, selector }) => {
  const handleEscape = ({ e }) => {
    if (e.key === 'Escape') {
      onCloseDialog();
    }
  };
  const trapFocus = createFocusTrapper({
    element: document.querySelector(selector),
  });
  const eventHandler = e => {
    handleEscape({ e });
    trapFocus({ e });
  };
  document.addEventListener('keydown', eventHandler);
  return () => document.removeEventListener('keydown', eventHandler);
};

const useModalKeyboardEvents = ({ modalSelector, onCloseModal }) => {
  useEffect(() => {
    const cleanEventHandlers = [];
    cleanEventHandlers.push(
      setupKeyboardShortcuts({
        onCloseDialog: onCloseModal,
        selector: modalSelector,
      }),
    );
    return () => cleanEventHandlers.forEach(cleanCallBack => cleanCallBack());
  }, []);
};

export { useModalKeyboardEvents };

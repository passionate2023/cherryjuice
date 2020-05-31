import { useEffect } from 'react';

const KEYCODE_TAB = 9;
const createFocusTrapper = ({
  element,
  focusableElementsSelector = [],
}: {
  element: HTMLElement;
  focusableElementsSelector?: string[];
}) => {
  // https://hiddedevries.nl/en/blog/2017-01-29-using-javascript-to-trap-focus-in-an-element
  const focusableEls: HTMLInputElement[] = Array.from(
    element.querySelectorAll(
      // 'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])',
      (focusableElementsSelector.length
        ? focusableElementsSelector.join(', ') + ', '
        : '') +
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
    if (isTabPressed) {
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
    }
  };
};

const setupKeyboardShortcuts = ({
  onCloseModal,
  onConfirmModal,
  selector,
  focusableElementsSelector,
}) => {
  const handleEscape = ({ e }) => {
    if (e.key === 'Escape') {
      onCloseModal();
    }
  };
  const handleEnterKey = ({ e }) => {
    if (e.key === 'Enter' && onConfirmModal) {
      onConfirmModal();
    }
  };
  const trapFocus = createFocusTrapper({
    element: document.querySelector(selector),
    focusableElementsSelector,
  });
  const eventHandler = e => {
    handleEscape({ e });
    handleEnterKey({ e });
    trapFocus({ e });
  };
  document.addEventListener('keydown', eventHandler);
  return () => document.removeEventListener('keydown', eventHandler);
};

const useModalKeyboardEvents = ({
  modalSelector,
  onCloseModal,
  onConfirmModal,
  focusableElementsSelector = [],
  enabled = true,
}) => {
  useEffect(() => {
    const cleanEventHandlers = [];
    if (enabled) {
      cleanEventHandlers.push(
        setupKeyboardShortcuts({
          onCloseModal,
          selector: modalSelector,
          focusableElementsSelector,
          onConfirmModal,
        }),
      );
    }
    return () => cleanEventHandlers.forEach(cleanCallBack => cleanCallBack());
  }, [onConfirmModal]);
};

export { useModalKeyboardEvents };

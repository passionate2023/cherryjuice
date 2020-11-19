import { createFocusTrapper } from '::hooks/modals/close-modal/helpers/handle-keyboard-events/helpers/create-focus-trapper';
import {
  dataAttributes,
  ModalsState,
} from '::hooks/modals/close-modal/use-modal-keyboard-events';

const eventHandler = {
  current: undefined,
};
type Options = {
  resumeFocus?: boolean;
};
export const attachEventHandler = (
  state: ModalsState,
  { resumeFocus }: Options = {},
) => {
  const modal = state.current;
  if (!modal) return;
  const element: HTMLElement = document.querySelector(
    `[${dataAttributes.keyboardEvents}="${modal.id}"]`,
  );
  const { focusableElements, trapFocus } = createFocusTrapper({
    element,
    focusableElementsSelector: modal.focusableElementsSelector,
  });
  if (resumeFocus && focusableElements.length) {
    focusableElements[0].focus();
  }
  if (eventHandler.current) {
    document.removeEventListener('keydown', eventHandler.current);
  }
  eventHandler.current = e => {
    if (e.key === 'Escape') {
      modal.dismiss();
      state.delete(modal);
      attachEventHandler(state);
    } else if (e.key === 'Enter') {
      if (modal.confirm) modal.confirm();
      state.delete(modal);
      attachEventHandler(state);
    } else trapFocus({ e });
  };

  document.addEventListener('keydown', eventHandler.current);
};

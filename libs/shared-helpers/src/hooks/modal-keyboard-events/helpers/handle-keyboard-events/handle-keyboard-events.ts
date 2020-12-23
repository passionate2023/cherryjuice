import { createFocusTrapper } from './helpers/create-focus-trapper';
import { dataAttributes, ModalsState } from '../../modal-keyboard-events';

const eventHandler = {
  current: undefined,
};
type Options = {
  resumeFocus?: boolean;
};
export const attachEventHandler = (
  state: ModalsState,
  // eslint-disable-next-line no-unused-vars
  options: Options = {},
) => {
  const modal = state.current;
  if (!modal) return;
  const element: HTMLElement = document.querySelector(
    `[${dataAttributes.keyboardEvents}="${modal.id}"]`,
  );
  const { trapFocus } = createFocusTrapper({
    element,
    focusableElementsSelector: modal.focusableElementsSelector,
  });
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

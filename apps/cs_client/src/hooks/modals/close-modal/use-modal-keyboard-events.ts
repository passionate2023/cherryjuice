import { useEffect, useRef } from 'react';
import { attachEventHandler } from '::hooks/modals/close-modal/helpers/handle-keyboard-events/handle-keyboard-events';

export type ModalsState = {
  _modals: Modal[];
  delete: (modal: Modal) => void;
  add: (modal: Modal) => void;
  current: Modal;
};

export type Modal = {
  id?: string;
  dismiss: () => void;
  confirm?: () => void;
  focusableElementsSelector: string[];
};

const state: ModalsState = {
  _modals: [],
  delete: modal => {
    state._modals = state._modals.filter(_modal => _modal.id !== modal.id);
  },
  add: modal => {
    state.delete(modal);
    state._modals.push(modal);
  },
  get current() {
    return state._modals[state._modals.length - 1];
  },
};

export const dataAttributes = {
  keyboardEvents: 'data-kb-e-id',
  clickOutside: 'data-clk-out-e-id',
};

const useModalKeyboardEvents = (modal: Omit<Modal, 'id'>) => {
  const ref = useRef<string>();
  if (!ref.current) ref.current = Date.now() + '';

  useEffect(() => {
    modal['id'] = ref.current;
    state.add(modal);
    attachEventHandler(state);
    return () => {
      state.delete(modal);
      attachEventHandler(state, { resumeFocus: true });
    };
  }, [modal.confirm, modal.dismiss]);
  return { [dataAttributes.keyboardEvents]: ref.current };
};

export { useModalKeyboardEvents };

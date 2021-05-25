import { useMachine } from '@xstate/react';
import { searchMachine } from '::shared-components/search-input/machine/search-machine';
import { useEffect } from 'react';
import { SearchProps } from '::shared-components/search-input/search';

export const useSearchMachine = ({
  providedValue,
  hideableInput,
  onChange,
  hideInput,
  disabled,
  onInputShown,
}: SearchProps) => {
  const [state, send, service] = useMachine(
    searchMachine.withContext({ value: providedValue, hideableInput }),
    { devTools: true },
  );
  useEffect(() => {
    send('change', { value: providedValue });
  }, [providedValue]);
  useEffect(() => {
    service.onTransition(state => {
      onChange(state.context.value);
    });
  }, []);
  useEffect(() => {
    if (hideInput) send('hide');
    else send('show');
  }, [hideInput]);
  useEffect(() => {
    if (disabled) send('disable');
    else send('enable');
  }, [disabled]);
  const shownInput = state.matches('visibility.visible');
  useEffect(() => {
    if (onInputShown) onInputShown(shownInput);
  }, [shownInput]);
  const shownInputButton = shownInput && hideableInput === 'manual';
  const disabledTyping = state.matches('typing.disabled');
  const inputValue = state.context.value;
  const toggleInputVisibility = () => send('toggle');
  const clearSearchInput = () => send('clear');
  const onInputChange = value => send('change', { value });
  return [
    { toggleInputVisibility, clearSearchInput, onInputChange },
    { shownInput, shownInputButton, disabledTyping, inputValue },
  ];
};

import * as React from 'react';
import {
  joinClassNames,
  useLazyAutoFocus,
  useOnKeyPress,
} from '@cherryjuice/shared-helpers';
import { useRef } from 'react';
import mod from './search-input.scss';
import { Icon } from '@cherryjuice/icons';

type Props = {
  placeholder: string;
  value: string;
  lazyAutoFocus?: boolean;
  performSearch?: () => void;
  clearSearchInput: () => void;
  onChange: (newValue: string) => void;
  disabled: boolean;
};
export const SearchInput: React.FC<Props> = ({
  performSearch,
  lazyAutoFocus,
  placeholder,
  value,
  onChange,
  clearSearchInput,
  disabled,
}) => {
  const input = useRef<HTMLInputElement>();
  useLazyAutoFocus(lazyAutoFocus, input);
  useOnKeyPress({
    ref: input,
    keys: performSearch ? ['Enter'] : [],
    onClick: performSearch,
  });
  return (
    <span
      className={joinClassNames([
        mod.searchInput,
        disabled && mod.searchInputDisabled,
      ])}
    >
      <input
        className={joinClassNames([mod.searchInput__input])}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        ref={input}
      />
      {value && (
        <span
          className={joinClassNames([mod.clearSearchButton])}
          onClick={clearSearchInput}
        >
          <Icon name={'clear'} size={16} />
        </span>
      )}
    </span>
  );
};

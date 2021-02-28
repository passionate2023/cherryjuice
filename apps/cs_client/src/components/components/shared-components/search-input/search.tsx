import * as React from 'react';
import mod from './search.scss';
import { SearchInput } from '::shared-components/search-input/components/search-input/search-input';
import { SearchButton } from '::shared-components/search-input/components/search-button/search-button';
import { HideInput } from '::shared-components/search-input/components/hide-input/hide-input';
import { joinClassNames } from '@cherryjuice/shared-helpers';
import { SearchContext } from '::shared-components/search-input/machine/search-machine';
import { useSearchMachine } from '::shared-components/search-input/hooks/search-machine';
import { useEffect, useRef } from 'react';
import { IconName } from '@cherryjuice/icons';

const cssVariables = {
  elementHeight: '--search-element-height',
  elementWidth: '--search-element-width',
  buttonBc: '--search-button-bc',
  buttonHoverBc: '--search-button-hover-bc',
};
type EmptyFunction = () => void;
export type SearchProps = {
  providedValue: string;
  hideableInput?: SearchContext['hideableInput'];
  disabled?: boolean;
  hideInput?: boolean;
  placeholder: string;
  onChange: (value: string) => void;
  performSearch?: EmptyFunction;
  lazyAutoFocus?: boolean;
  onInputShown?: (value: boolean) => void;
  style?: {
    elementHeight?: number | string;
    elementWidth?: number | string;
    buttonBc?: string;
    icon?: IconName;
    buttonHoverBc?: string;
  };
  tooltip?: string;
};

const Search: React.FC<SearchProps> = ({
  providedValue,
  hideableInput,
  onChange,
  hideInput,
  performSearch,
  placeholder,
  disabled,
  lazyAutoFocus,
  onInputShown,
  style = {},
  tooltip,
}) => {
  const [
    { toggleInputVisibility, clearSearchInput, onInputChange },
    { disabledTyping, shownInput, shownInputButton, inputValue },
  ] = useSearchMachine({
    providedValue,
    hideableInput,
    onChange,
    hideInput,
    performSearch,
    placeholder,
    disabled,
    lazyAutoFocus,
    onInputShown,
  });
  const ref = useRef<HTMLDivElement>();
  useEffect(() => {
    Object.entries(style).forEach(([k, v]) => {
      if (cssVariables[k])
        ref.current.style.setProperty(
          cssVariables[k],
          v + (typeof v === 'string' ? '' : 'px'),
        );
    });
  }, [style]);
  return (
    <div
      className={joinClassNames([
        mod.search,
        !shownInput && mod.searchHiddenInput,
      ])}
      ref={ref}
    >
      {shownInputButton && <HideInput hideInput={toggleInputVisibility} />}
      {shownInput && (
        <SearchInput
          onChange={onInputChange}
          value={inputValue}
          placeholder={placeholder}
          performSearch={performSearch}
          lazyAutoFocus={lazyAutoFocus}
          clearSearchInput={clearSearchInput}
          disabled={disabledTyping}
        />
      )}
      {(performSearch || !shownInput) && (
        <SearchButton
          disabled={
            shownInput || hideableInput === 'external' ? disabledTyping : false
          }
          onClick={
            shownInput || hideableInput === 'external'
              ? performSearch
              : toggleInputVisibility
          }
          icon={style.icon || 'search'}
          tooltip={tooltip}
        />
      )}
    </div>
  );
};

export { Search };

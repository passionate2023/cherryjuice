import * as React from 'react';
import { MutableRefObject, useCallback, useRef } from 'react';
import { modSearch } from '::sass-modules';
import { ButtonSquare } from '@cherryjuice/components';
import { joinClassNames } from '@cherryjuice/shared-helpers';
import { Icon, Icons } from '@cherryjuice/icons';
import { useLazyAutoFocus } from '@cherryjuice/shared-helpers';
import { Tooltip } from '@cherryjuice/components';

type Props = {
  containerClassName?: string;
  fieldWrapperClassName?: string;
  searchButtonClassName?: string;
  inputRef?: MutableRefObject<HTMLDivElement>;
  value: string;
  placeHolder: string;
  searchImpossible: boolean;
  onChange: (value: string) => void;
  onClear: () => void;
  performSearch?: () => void;
  disabled?: boolean;
  lazyAutoFocus?: boolean;
  autoCollapse?: boolean;
};

const SearchInput: React.FC<Props> = ({
  containerClassName,
  fieldWrapperClassName,
  searchButtonClassName,
  inputRef,
  value,
  onChange,
  onClear,
  searchImpossible,
  performSearch,
  placeHolder,
  disabled,
  lazyAutoFocus,
  autoCollapse,
}) => {
  const onChangeM = useCallback(e => {
    onChange(e.target.value);
  }, []);
  const input = useRef<HTMLInputElement>();
  useLazyAutoFocus(lazyAutoFocus, input);
  return (
    <div
      className={joinClassNames([
        modSearch.search__container,
        containerClassName,
        [modSearch.search__containerDisabled, disabled],
      ])}
    >
      {!disabled && (
        <div
          className={joinClassNames([
            modSearch.search__field,
            fieldWrapperClassName,
            [modSearch.search__fieldContainerCollapsed, autoCollapse],
          ])}
          ref={inputRef}
        >
          <input
            className={joinClassNames([
              modSearch.search__field__input,
              [modSearch.search__fieldCollapsed, autoCollapse],
            ])}
            type="text"
            placeholder={placeHolder}
            value={value}
            onChange={onChangeM}
            ref={input}
          />
          <div className={modSearch.search__field__buttons}>
            <ButtonSquare
              className={joinClassNames([
                modSearch.search__searchButton,
                modSearch.search__field__button,
                [modSearch.search__field__buttonVisible, value.length],
                [modSearch.search__fieldCollapsed, autoCollapse],
                searchButtonClassName,
              ])}
              onClick={onClear}
              icon={<Icon name={Icons.material.clear} />}
            />
            {performSearch && (
              <Tooltip label={placeHolder}>
                <ButtonSquare
                  className={joinClassNames([
                    modSearch.search__searchButton,
                    searchButtonClassName,
                  ])}
                  disabled={searchImpossible || disabled}
                  onClick={performSearch}
                  icon={<Icon name={Icons.material.search} />}
                />
              </Tooltip>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export { SearchInput };

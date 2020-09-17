import * as React from 'react';
import { modSearch } from '::sass-modules';
import { MutableRefObject, useCallback } from 'react';
import { ButtonSquare } from '::root/components/shared-components/buttons/button-square/button-square';
import { joinClassNames } from '::helpers/dom/join-class-names';
import { Icon, Icons } from '::root/components/shared-components/icon/icon';

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
}) => {
  const onChangeM = useCallback(e => {
    onChange(e.target.value);
  }, []);
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
          className={`${modSearch.search__field} ${fieldWrapperClassName ||
            ''}`}
          ref={inputRef}
        >
          <input
            className={modSearch.search__field__input}
            type="text"
            placeholder={placeHolder}
            value={value}
            onChange={onChangeM}
          />
          <ButtonSquare
            className={joinClassNames([
              modSearch.search__searchButton,
              searchButtonClassName,
              modSearch.search__field__clearTextButton,
              [modSearch.search__clearTextButtonVisible, value.length],
            ])}
            onClick={onClear}
            icon={<Icon name={Icons.material.clear} />}
          />
        </div>
      )}
      {performSearch && (
        <ButtonSquare
          className={joinClassNames([
            modSearch.search__searchButton,
            searchButtonClassName,
          ])}
          disabled={searchImpossible || disabled}
          onClick={performSearch}
          icon={<Icon name={Icons.material.search} />}
        />
      )}
    </div>
  );
};

export { SearchInput };

import * as React from 'react';
import { modChips, modNodeMeta, modTextInput } from '::sass-modules';
import { joinClassNames } from '@cherryjuice/shared-helpers';
import { testIds } from '::cypress/support/helpers/test-ids';
import { ButtonSquare } from '@cherryjuice/components';
import { Icons } from '@cherryjuice/icons';
import { useCallback, useMemo, useRef, useState } from 'react';
import { ChipProps } from '::root/components/app/components/menus/dialogs/document-meta/components/chips/components/chip';

const useTextInput: () => [string, (e) => void] = () => {
  const [inputValue, setInputValue] = useState('');
  const setInputValueM = useCallback(e => {
    setInputValue(e.target.value);
  }, []);

  return [inputValue, setInputValueM];
};

export type AddChipCallback = (
  chip: string,
) => Promise<{ clearInput: boolean }>;
export type AddChipProps = {
  pattern?: string;
  placeholder: string;
  addChip: AddChipCallback;
  chips: ChipProps[];
  label: string;
};

const AddChip: React.FC<AddChipProps> = ({
  addChip,
  placeholder,
  pattern,
  chips,
  label,
}) => {
  const [inputValue, setInputValue] = useTextInput();
  const inputRef = useRef<HTMLInputElement>();

  const duplicateChip = useMemo(() => {
    return chips.some(
      _chip => _chip.text.toLowerCase() === inputValue.toLowerCase(),
    );
  }, [chips, inputValue]);

  const addChipM = useCallback(() => {
    if (inputRef.current.checkValidity() && !duplicateChip) {
      addChip(inputRef.current.value).then(({ clearInput }) => {
        if (clearInput) setInputValue({ target: { value: '' } });
      });
    }
  }, [addChip, chips, duplicateChip]);
  return (
    <div className={modChips.chips__addChip}>
      <div className={modChips.chips__addChip__inputs}>
        <span className={modNodeMeta.nodeMeta__input__label}>{label}</span>
        <div
          className={joinClassNames([
            modChips.guests__addGuest__inputContainer,
          ])}
        >
          <input
            ref={inputRef}
            value={inputValue}
            onChange={setInputValue}
            type="text"
            pattern={pattern}
            className={joinClassNames([
              modChips.chips__addChip__input,
              modTextInput.textInput,
            ])}
            placeholder={placeholder}
            data-testid={testIds.form__chips__input}
          />
          <ButtonSquare
            iconName={Icons.material.add}
            className={modChips.chips__addChip__button}
            onClick={addChipM}
            disabled={
              !inputRef.current?.checkValidity() || !inputValue || duplicateChip
            }
            testId={testIds.form__chips__addChip}
          />
        </div>
      </div>
    </div>
  );
};

export { AddChip };

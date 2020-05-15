import * as React from 'react';
import { modNodeMeta } from '::sass-modules/index';
import { FormInput } from '::app/menus/node-meta/components/form-input';
import { IconPicker } from '::app/menus/node-meta/components/icon-picker';
import { NodeCached } from '::types/graphql/adapters';
import { MutableRefObject } from 'react';

type Props = {
  node: NodeCached;
  refs: {
    nameInput: MutableRefObject<HTMLInputElement>;
    isBoldInput: MutableRefObject<HTMLInputElement>;
    customColorValueInput: MutableRefObject<HTMLInputElement>;
    customIconValue: MutableRefObject<HTMLInputElement>;
    isReadOnlyInput: MutableRefObject<HTMLInputElement>;
    hasCustomColorInput: MutableRefObject<HTMLInputElement>;
    hasCustomIconInput: MutableRefObject<HTMLInputElement>;
  };
};

const Form: React.FC<Props> = ({
  node: { node_title_styles, icon_id, read_only, name } = {
    node_title_styles: '{"color":"#ffffff","fontWeight":"bold"}',
    icon_id: '0',
    read_only: 0,
    name: '',
  },
  refs: {
    nameInput,
    isBoldInput,
    customColorValueInput,
    customIconValue,
    isReadOnlyInput,
    hasCustomColorInput,
    hasCustomIconInput,
  },
}) => {
  const style = JSON.parse(node_title_styles);
  const isBold = style.fontWeight === 'bold';
  const hasCustomColor = style.color !== ('#ffffff' || 'rgb(255, 255, 255)');
  const hasCustomIcon = +icon_id !== 0;
  return (
    <>
      <div className={modNodeMeta.nodeMeta}>
        <FormInput
          defaultValue={name}
          type={'text'}
          inputRef={nameInput}
          label={'Node name'}
        />
        <FormInput
          defaultValue={isBold}
          type={'checkbox'}
          inputRef={isBoldInput}
          label={'Bold'}
        />
        <FormInput
          defaultValue={hasCustomColor}
          type={'checkbox'}
          label={'User selected color'}
          inputRef={hasCustomColorInput}
          additionalInput={({ disabled }) => (
            <input
              disabled={disabled}
              type={'color'}
              defaultValue={style.color}
              ref={customColorValueInput}
              className={`${modNodeMeta.nodeMeta__input__colorInput} ${
                disabled ? modNodeMeta.nodeMeta__inputDisabled : ''
              }`}
            />
          )}
        />
        <FormInput
          defaultValue={hasCustomIcon}
          type={'checkbox'}
          inputRef={hasCustomIconInput}
          label={'User selected icon'}
          additionalInput={({ disabled }) => (
            <IconPicker
              selectedIcon={icon_id}
              disabled={disabled}
              inputRef={customIconValue}
            />
          )}
        />
        <FormInput
          defaultValue={Boolean(read_only)}
          type={'checkbox'}
          inputRef={isReadOnlyInput}
          label={'Read only'}
        />
      </div>
    </>
  );
};

export { Form };

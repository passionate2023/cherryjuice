import * as React from 'react';
import { modNodeMeta } from '::sass-modules/index';
import { FormInput } from '::app/menus/node-meta/components/form-input';
import { IconPicker } from '::app/menus/node-meta/components/icon-picker';
import {
  nodeMetaActionCreators,
  TNodeMetaState,
} from '::app/menus/node-meta/reducer/reducer';

type Props = {
  state: TNodeMetaState;
};

const Form: React.FC<Props> = ({ state }) => {
  return (
    <div className={modNodeMeta.nodeMeta}>
      <FormInput
        onChange={nodeMetaActionCreators.setName}
        value={state.name}
        type={'text'}
        label={'Node name'}
        lazyAutoFocus={400}
        testId={'node-name'}
      />
      <FormInput
        onChange={nodeMetaActionCreators.setIsBold}
        value={state.isBold}
        type={'checkbox'}
        label={'Bold'}
      />
      <FormInput
        onChange={nodeMetaActionCreators.setHasCustomColor}
        value={state.hasCustomColor}
        type={'checkbox'}
        label={'User selected color'}
        additionalInput={({ disabled }) => (
          <input
            disabled={disabled}
            type={'color'}
            onChange={e =>
              nodeMetaActionCreators.setCustomColor(e.target.value)
            }
            value={state.customColor}
            className={`${modNodeMeta.nodeMeta__input__colorInput} ${
              disabled ? modNodeMeta.nodeMeta__inputDisabled : ''
            }`}
          />
        )}
      />
      <FormInput
        onChange={nodeMetaActionCreators.setHasCustomIcon}
        value={state.hasCustomIcon}
        type={'checkbox'}
        label={'User selected icon'}
        additionalInput={({ disabled }) => (
          <IconPicker
            onChange={nodeMetaActionCreators.setCustomIcon}
            value={state.customIcon}
            disabled={disabled}
          />
        )}
      />
      <FormInput
        onChange={nodeMetaActionCreators.setIsReadOnly}
        value={state.isReadOnly}
        type={'checkbox'}
        label={'Read only'}
      />
    </div>
  );
};

export { Form };

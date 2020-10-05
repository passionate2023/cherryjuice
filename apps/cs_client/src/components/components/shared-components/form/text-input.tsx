import * as React from 'react';
import { modTextInput } from '::sass-modules';
import { EventHandler } from 'react';

const TextInput = ({
  value,
  topLevelClassName,
  onChange,
  onKeyUp,
}: {
  value: string;
  hint?: string;
  topLevelClassName?: string;
  onChange?: EventHandler<any>;
  onKeyUp?: EventHandler<any>;
}) => (
  <label className={`${topLevelClassName || ''}`}>
    <input
      className={modTextInput.textInput}
      type="text"
      value={value}
      {...(onChange && { onChange })}
      {...(onKeyUp && { onKeyUp })}
    />
  </label>
);

export { TextInput };

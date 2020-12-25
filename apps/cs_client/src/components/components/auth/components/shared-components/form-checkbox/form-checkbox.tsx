import * as React from 'react';
import modLogin from './form-checkbox.scss';
import { Checkbox } from '::shared-components/form/checkbox';
import { MutableRefObject } from 'react';

type Props = {
  text: string;
  _ref: MutableRefObject<HTMLInputElement>;
};

export const FormCheckbox: React.FC<Props> = ({ text, _ref }) => {
  return (
    <span
      className={modLogin.formCheckbox}
      tabIndex={0}
      onKeyUp={e => {
        if (e.key === ' ') _ref.current.click();
      }}
    >
      <Checkbox className={modLogin.formCheckbox__checkbox} myRef={_ref} />{' '}
      <span>{text}</span>
    </span>
  );
};

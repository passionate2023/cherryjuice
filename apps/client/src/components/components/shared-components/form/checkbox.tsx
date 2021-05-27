import modCheckbox from '::sass-modules/shared-components/checkbox.scss';
import * as React from 'react';
import { Ref } from 'react';

type Props = {
  className: string;
  myRef: Ref<HTMLInputElement>;
};

const Checkbox: React.FC<Props> = ({ className, myRef }) => {
  return (
    <label className={modCheckbox.container + ' ' + className}>
      <input type="checkbox" defaultChecked={true} ref={myRef} tabIndex={-1} />
      <span className={modCheckbox.checkmark} />
    </label>
  );
};

export { Checkbox };

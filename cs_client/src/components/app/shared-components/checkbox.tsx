import modCheckbox from '::sass-modules/shared-components/checkbox.scss';
import * as React from 'react';

type Props = {
  className: string;
};

const Checkbox: React.FC<Props> = ({ className }) => {
  return (
    <label className={modCheckbox.container + ' ' + className}>
      <input type="checkbox" defaultChecked={true} />
      <span className={modCheckbox.checkmark} />
    </label>
  );
};

export { Checkbox };

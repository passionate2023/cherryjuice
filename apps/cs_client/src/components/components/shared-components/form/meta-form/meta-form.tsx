import * as React from 'react';
import { modNodeMeta } from '::sass-modules';
import {
  MetaFormInput,
  FormInputProps,
} from '::root/components/shared-components/form/meta-form/meta-form-input';

type Props = {
  inputs: FormInputProps[];
};

const MetaForm: React.FC<Props> = ({ inputs }) => {
  return (
    <div className={modNodeMeta.nodeMeta}>
      {inputs.map(props => (
        <MetaFormInput {...props} key={props.label} />
      ))}
    </div>
  );
};

export { MetaForm };

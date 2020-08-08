import * as React from 'react';
import modSettings from '::sass-modules/settings/settings.scss';
import { TextInput } from '::shared-components/text-input';

export type PersonalInformationProps = {
  testId?: string;
  label: string;
  value: string;
  onChange: (string) => void;
  component?: JSX.Element;
} & (
  | {
      type: 'input';
    }
  | { type: 'component'; component: JSX.Element }
);

const PersonalInformation: React.FC<PersonalInformationProps> = ({
  label,
  value,
  type,
  component,
  onChange,
}) => {
  return (
    <span className={modSettings.settings__settingElement}>
      <span className={modSettings.settings__settingElement__name}>
        {label}
      </span>
      {type === 'input' ? (
        <TextInput value={value} onChange={onChange} />
      ) : (
        component
      )}
    </span>
  );
};

export { PersonalInformation };

import * as React from 'react';
import { modSettings } from '::sass-modules';

type Props = {
  name: string;
};

const SettingsElement: React.FC<Props> = ({ name, children }) => {
  return (
    <div className={modSettings.settingsElement}>
      <span className={modSettings.settingsElement__name}>{name}</span>
      {children}
    </div>
  );
};

export { SettingsElement };

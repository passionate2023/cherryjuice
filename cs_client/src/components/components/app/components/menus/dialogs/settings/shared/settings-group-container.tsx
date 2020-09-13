import * as React from 'react';
import modSettings from '::sass-modules/settings/settings.scss';

type Props = {};

const SettingsGroupContainer: React.FC<Props> = ({ children }) => {
  return <div className={modSettings.settings__groupContainer}>{children}</div>;
};

export { SettingsGroupContainer };

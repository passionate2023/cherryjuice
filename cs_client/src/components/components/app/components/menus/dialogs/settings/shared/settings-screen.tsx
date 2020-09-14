import * as React from 'react';
import modSettings from '::sass-modules/settings/settings.scss';

type Props = {};

const SettingsScreen: React.FC<Props> = ({ children }) => {
  return <div className={modSettings.settings__screen}>{children}</div>;
};

export { SettingsScreen };

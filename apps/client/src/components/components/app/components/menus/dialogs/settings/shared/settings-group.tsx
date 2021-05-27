import * as React from 'react';
import { modUserProfile } from '::sass-modules';

type Props = {
  name: string;
};

const SettingsGroup: React.FC<Props> = ({ name, children }) => {
  return (
    <div className={modUserProfile.userProfile__group}>
      <span className={modUserProfile.userProfile__group__name}>{name}</span>
      <div className={modUserProfile.userProfile__group__elements}>
        {children}
      </div>
    </div>
  );
};

export { SettingsGroup };

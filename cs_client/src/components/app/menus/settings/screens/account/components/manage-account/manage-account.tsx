import * as React from 'react';
import { modUserProfile } from '::sass-modules';
import { ButtonSquare } from '::shared-components/buttons/button-square/button-square';
import { ac } from '::root/store/store';

type Props = {};

const ManageAccount: React.FC<Props> = () => {
  return (
    <div className={modUserProfile.userProfile__group}>
      <span className={modUserProfile.userProfile__group__name}>account</span>
      <div className={modUserProfile.userProfile__group__elements}>
        <ButtonSquare
          text={'delete account'}
          onClick={ac.auth.deleteAccount}
          variant={'danger'}
        />
      </div>
    </div>
  );
};

export { ManageAccount };

import * as React from 'react';
import { ButtonSquare } from '@cherryjuice/components';
import { ac } from '::store/store';
import { SettingsGroup } from '::root/components/app/components/menus/dialogs/settings/shared/settings-group';

type Props = {};

const ManageAccount: React.FC<Props> = () => {
  return (
    <SettingsGroup name={'account'}>
      <ButtonSquare
        text={'delete account'}
        onClick={ac.auth.deleteAccount}
        variant={'danger'}
      />
    </SettingsGroup>
  );
};

export { ManageAccount };

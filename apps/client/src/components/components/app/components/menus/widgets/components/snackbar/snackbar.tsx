import * as React from 'react';
import { modSnackbar } from '::sass-modules';
import { Icon, Icons } from '@cherryjuice/icons';
import { addNumbers, ButtonCircle } from '@cherryjuice/components';
import { useEffect } from 'react';
import { ac } from '::store/store';
import { Snackbar as TSnackbar } from '::store/ducks/dialogs';
import { headerVariant } from '::root/components/shared-components/modal/base-modal';
import { joinClassNames } from '@cherryjuice/shared-helpers';

type Props = {
  snackbar: TSnackbar;
};

const Snackbar: React.FC<Props> = ({ snackbar }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      ac.dialogs.clearSnackbar();
    }, snackbar.lifeSpan || 6000);
    return () => {
      clearInterval(timer);
    };
  }, [snackbar.message]);
  return (
    <div className={modSnackbar.snackbar}>
      <span
        className={joinClassNames([
          modSnackbar.snackbar__message,
          [headerVariant[snackbar.type], snackbar.type],
        ])}
      >
        {snackbar.message}
      </span>
      <ButtonCircle
        key={Icons.material.delete}
        className={modSnackbar.snackbar__closeButton}
        onClick={ac.dialogs.clearSnackbar}
        icon={<Icon {...{ name: Icons.material.clear }} />}
      />
    </div>
  );
};

const _ = React.memo(Snackbar);
export { _ as Snackbar };

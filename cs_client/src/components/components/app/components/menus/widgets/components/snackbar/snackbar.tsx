import * as React from 'react';
import { modSnackbar } from '::sass-modules';
import { Icon, Icons } from '::root/components/shared-components/icon/icon';
import { ButtonCircle } from '::root/components/shared-components/buttons/button-circle/button-circle';
import { useEffect } from 'react';
import { ac } from '::store/store';
import { Snackbar as TSnackbar } from '::store/ducks/dialogs';
import { headerVariant } from '::root/components/shared-components/modal/base-modal';

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
        className={
          modSnackbar.snackbar__message + snackbar.type
            ? headerVariant[snackbar.type]
            : ''
        }
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

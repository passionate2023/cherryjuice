import * as React from 'react';
import { modSnackbar } from '::sass-modules';
import { Icon, Icons } from '::root/components/shared-components/icon/icon';
import { ButtonCircle } from '::root/components/shared-components/buttons/button-circle/button-circle';
import { useEffect } from 'react';
import { ac } from '::store/store';

type Props = {
  message: string;
  autoCloseDuration?: number;
};

const Snackbar: React.FC<Props> = ({ message, autoCloseDuration = 6000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      ac.dialogs.clearSnackbar();
    }, autoCloseDuration);
    return () => {
      clearInterval(timer);
    };
  }, [message]);
  return (
    <div className={modSnackbar.snackbar}>
      <span className={modSnackbar.snackbar__message}>{message}</span>
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

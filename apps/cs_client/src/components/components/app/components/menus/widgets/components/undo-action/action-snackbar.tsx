import * as React from 'react';
import { modSnackbar } from '::sass-modules';
import { Icons } from '::root/components/shared-components/icon/icon';
import { ac } from '::store/store';
import { ButtonCircle } from '::root/components/shared-components/buttons/button-circle/button-circle';
import { useEffect, useRef, useState } from 'react';

type Props = {
  actionName: string;
  autoCloseDuration?: number;
  buttons: JSX.Element;
  hide: () => void;
};
const ActionSnackbar: React.FC<Props> = ({
  autoCloseDuration = 2500,
  actionName,
  hide,
  buttons,
}) => {
  const [mouseIn, setMouseIn] = useState(false);
  const intervalRef = useRef<any>();
  useEffect(() => {
    if (mouseIn) {
      clearInterval(intervalRef.current);
    } else {
      intervalRef.current = setTimeout(() => {
        hide();
      }, autoCloseDuration);
      return () => {
        clearInterval(intervalRef.current);
      };
    }
  }, [mouseIn]);

  return (
    <div
      className={modSnackbar.snackbar}
      onMouseEnter={() => setMouseIn(true)}
      onMouseLeave={() => setMouseIn(false)}
    >
      <span className={modSnackbar.snackbar__message}>{actionName}</span>
      <div className={modSnackbar.snackbar__buttons}>
        {buttons}
        <ButtonCircle
          key={Icons.material.delete}
          onClick={ac.timelines.hideUndoDocumentAction}
          iconName={Icons.material.clear}
        />
      </div>
    </div>
  );
};

export { ActionSnackbar };

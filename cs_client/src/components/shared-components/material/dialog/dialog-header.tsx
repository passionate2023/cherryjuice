import { modDialog } from '::sass-modules/index';
import * as React from 'react';
import { DrawerToggle } from '::shared-components/material/drawer/drawer-toggle';
import { CircleButton } from '::shared-components/buttons/circle-button';
import { EventHandler } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

type Props = { dialogTitle: string; onButton1: EventHandler<undefined> };

const DialogHeader: React.FC<Props> = ({ dialogTitle, onButton1 }) => {
  return (
    <div className={modDialog.dialog__header}>
      <DrawerToggle />
      <h2 className={modDialog.dialog__header__title}>{dialogTitle}</h2>
      <span className={modDialog.dialog__header__subTitle}>
        Keyboard shortcuts
      </span>
      <CircleButton
        className={modDialog.dialog__header__exitButton}
        onClick={onButton1}
      >
        <FontAwesomeIcon icon={faTimes} color={'#3b0503'} />
      </CircleButton>
    </div>
  );
};

export { DialogHeader };

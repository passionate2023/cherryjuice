import { modDialog } from '::sass-modules/index';
import * as React from 'react';
import { CircleButton } from '::shared-components/buttons/circle-button';
import { EventHandler } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

type Props = {
  dialogTitle: string;
  onCloseDialog: EventHandler<undefined>;
  menuButton?: JSX.Element;
};

const DialogHeader: React.FC<Props> = ({
  menuButton,
  dialogTitle,
  onCloseDialog,
}) => {
  return (
    <div className={modDialog.dialog__header}>
      {menuButton}
      <h2 className={modDialog.dialog__header__title}>{dialogTitle}</h2>
      <span className={modDialog.dialog__header__subTitle} />
      <CircleButton
        className={modDialog.dialog__header__exitButton}
        onClick={onCloseDialog}
      >
        <FontAwesomeIcon icon={faTimes} color={'#3b0503'} />
      </CircleButton>
    </div>
  );
};

export { DialogHeader };

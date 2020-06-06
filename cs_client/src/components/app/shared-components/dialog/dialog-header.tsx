import { modDialog } from '::sass-modules/index';
import * as React from 'react';
import { ButtonCircle } from '::shared-components/buttons/button-circle/button-circle';
import { EventHandler } from 'react';
import { Icon, Icons } from '::shared-components/icon';

export type DialogHeaderProps = {
  dialogTitle: string;
  onClose: EventHandler<undefined>;
  menuButton?: JSX.Element;
  rightHeaderButtons?: JSX.Element[];
};

const DialogHeader: React.FC<DialogHeaderProps> = ({
  menuButton,
  dialogTitle,
  onClose,
  rightHeaderButtons,
}) => {
  return (
    <div className={modDialog.dialog__header}>
      {menuButton}
      <h2 className={modDialog.dialog__header__title}>{dialogTitle}</h2>
      <span className={modDialog.dialog__header__subTitle} />
      <div className={modDialog.dialog__header__buttons}>
        {rightHeaderButtons}
        <ButtonCircle
          className={modDialog.dialog__header__exitButton}
          onClick={onClose}
        >
          <Icon name={Icons.material.close} />
        </ButtonCircle>
      </div>
    </div>
  );
};

export { DialogHeader };

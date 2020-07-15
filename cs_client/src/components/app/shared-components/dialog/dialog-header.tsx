import { modDialog } from '::sass-modules/index';
import * as React from 'react';
import { ButtonCircle } from '::shared-components/buttons/button-circle/button-circle';
import { EventHandler } from 'react';
import { Icon, Icons } from '::shared-components/icon/icon';
import { TDialogFooterButton } from '::shared-components/dialog/dialog-footer';
export type DialogHeaderButton = Pick<TDialogFooterButton, 'onClick'> & {
  icon: string;
  text: string;
  hidden?: boolean;
  className?: string;
  disabled?: boolean;
  testId?: string;
};
export type DialogHeaderProps = {
  dialogTitle: string;
  onClose: EventHandler<undefined>;
  menuButton?: JSX.Element;
  rightHeaderButtons?: DialogHeaderButton[];
};

const DialogHeader: React.FC<DialogHeaderProps> = ({
  menuButton,
  dialogTitle,
  onClose,
  rightHeaderButtons = [],
}) => {
  return (
    <div className={modDialog.dialog__header}>
      {menuButton}
      <h2 className={modDialog.dialog__header__title}>{dialogTitle}</h2>
      <span className={modDialog.dialog__header__subTitle} />
      <div className={modDialog.dialog__header__buttons}>
        {rightHeaderButtons.map(button =>
          button.hidden ? (
            <></>
          ) : (
            <ButtonCircle
              onClick={button.onClick}
              icon={<Icon name={button.icon} />}
              key={button.icon}
              className={button.className}
            />
          ),
        )}

        <ButtonCircle
          className={modDialog.dialog__header__exitButton}
          onClick={onClose}
          icon={<Icon {...{ name: Icons.material.close }} />}
        />
      </div>
    </div>
  );
};

export { DialogHeader };

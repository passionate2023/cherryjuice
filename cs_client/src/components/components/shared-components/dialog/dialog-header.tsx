import { modButton, modDialog } from '::sass-modules';
import * as React from 'react';
import { ButtonCircle } from '::root/components/shared-components/buttons/button-circle/button-circle';
import { EventHandler } from 'react';
import { Icon, Icons } from '::root/components/shared-components/icon/icon';
import { TDialogFooterButton } from '::root/components/shared-components/dialog/dialog-footer';
import { ac } from '::store/store';

export type DialogHeaderButton = Pick<TDialogFooterButton, 'onClick'> & {
  icon: string;
  text?: string;
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
  pinnable: boolean;
};

const DialogHeader: React.FC<DialogHeaderProps> = ({
  rightHeaderButtons = [],
  menuButton,
  dialogTitle,
  onClose,
  pinnable,
}) => {
  return (
    <div className={modDialog.dialog__header}>
      {menuButton}
      <h2 className={modDialog.dialog__header__title}>{dialogTitle}</h2>
      <span className={modDialog.dialog__header__subTitle} />
      <div className={modDialog.dialog__header__buttons}>
        {rightHeaderButtons.map(
          button =>
            !button.hidden && (
              <ButtonCircle
                onClick={button.onClick}
                testId={button.testId}
                icon={<Icon name={button.icon} />}
                key={button.icon}
                className={button.className}
                disabled={button.disabled}
              />
            ),
        )}
        {pinnable && (
          <ButtonCircle
            onClick={ac.root.toggleDockedDialog}
            className={modButton.buttonRotated45}
            iconName={Icons.material.pin}
          />
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

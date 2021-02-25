import mod from './dialog-header.scss';
import * as React from 'react';
import { ButtonCircle } from '@cherryjuice/components';
import { EventHandler, memo } from 'react';
import { TDialogFooterButton } from '::root/components/shared-components/dialog/dialog-footer';
import { ac } from '::store/store';
import { joinClassNames } from '@cherryjuice/shared-helpers';

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
  pinnable?: boolean;
  pinned?: boolean;
};

const iconSize = 15;
const DialogHeader: React.FC<DialogHeaderProps> = ({
  rightHeaderButtons = [],
  menuButton,
  dialogTitle,
  onClose,
  pinnable,
  pinned,
}) => {
  return (
    <div
      className={joinClassNames([
        mod.dialog__header,
        pinned && mod.dialog__headerPinned,
      ])}
    >
      {menuButton}
      <h2 className={mod.dialog__header__title}>{dialogTitle}</h2>
      <span className={mod.dialog__header__subTitle} />
      <div className={mod.dialog__header__buttons}>
        {rightHeaderButtons.map(button => {
          return (
            !button.hidden && (
              <ButtonCircle
                onClick={button.onClick}
                testId={button.testId}
                iconName={button.icon}
                iconSize={iconSize}
                key={button.icon}
                className={mod.dialog__header__button}
                disabled={button.disabled}
              />
            )
          );
        })}
        {pinnable && (
          <ButtonCircle
            onClick={ac.root.toggleDockedDialog}
            rotated45={true}
            iconName={'pin'}
            iconSize={iconSize - 1}
            className={mod.dialog__header__button}
          />
        )}
        <ButtonCircle
          onClick={onClose}
          iconName={'close'}
          iconSize={iconSize}
          className={mod.dialog__header__button}
        />
      </div>
    </div>
  );
};

const M = memo(DialogHeader);
export { M as DialogHeader };
export { mod as modDialogHeader };

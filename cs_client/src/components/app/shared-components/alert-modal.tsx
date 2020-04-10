import modAlertModal from '::sass-modules/shared-components/alert-modal.scss';
import * as React from 'react';
import { animated } from 'react-spring';
import { ButtonSquare } from '::shared-components/buttons/buttonSquare';
import { useModalKeyboardEvents } from '::hooks/use-modal-keyboard-events';
import { Icon, Icons } from '::shared-components/icon';
import { TransitionWrapper } from '::shared-components/transition-wrapper';
import { EventHandler } from 'react';
import { TAlert } from '::types/react';
import { usePrevPropIfNewPropIsUndefined } from '::hooks/use-prev-prop-if-new-prop-is-undefined';
export type ErrorModalProps = {
  alert: TAlert;
  onClose: EventHandler<undefined>;
};
export type ErrorModalWithTransition = ErrorModalProps & { style };
const AlertModal: React.FC<ErrorModalWithTransition> = ({
  alert,
  onClose,
  style,
}) => {
  useModalKeyboardEvents({
    onCloseModal: onClose,
    modalSelector: `.${modAlertModal.alertModal}`,
  });
  alert = usePrevPropIfNewPropIsUndefined<TAlert>(alert);
  return (
    <>
      {
        <animated.div
          className={modAlertModal.alertModal}
          style={{
            ...style,
            transform: style.xyz.interpolate(
              (x, y, z) => `scale(${z}) translate3d(${x}px,${y}px,0)`,
            ),
          }}
        >
          <Icon
            name={Icons.material[alert.type]}
            className={`${modAlertModal.alertModal__icon}`}
            extraLarge={true}
          />
          <span className={modAlertModal.alertModal__body}>
            <span className={`${modAlertModal.alertModal__header}`}>
              {alert?.title}
            </span>
            <span className={`${modAlertModal.alertModal__message}`}>
              {alert?.description}
            </span>
          </span>
          <ButtonSquare
            className={`${modAlertModal.alertModal__dismissButton}`}
            onClick={onClose}
            lazyAutoFocus={300}
          >
            Dismiss
          </ButtonSquare>
        </animated.div>
      }
    </>
  );
};

const AlertModalWithTransition: React.FC<ErrorModalProps> = ({
  alert,
  onClose,
}) => {
  return (
    <TransitionWrapper<ErrorModalProps>
      Component={AlertModal}
      show={Boolean(alert)}
      transitionValues={{
        from: { opacity: 0, xyz: [0, -25, 0.5] },
        enter: { opacity: 1, xyz: [0, 0, 1] },
        leave: { opacity: 0, xyz: [0, window.innerHeight * 0.5, 1] },
        config: {
          tension: 255,
          friction: 30,
        },
      }}
      componentProps={{
        onClose,
        alert,
      }}
      scrimProps={{ alertModal: true, onClick: onClose }}
    />
  );
};
export default AlertModalWithTransition;

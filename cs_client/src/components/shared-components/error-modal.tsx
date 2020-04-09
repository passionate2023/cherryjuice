import modErrorModal from '::sass-modules/shared-components/error-modal.scss';
import * as React from 'react';
import { animated } from 'react-spring';
import { ButtonSquare } from '::shared-components/buttons/buttonSquare';
import { useModalKeyboardEvents } from '::hooks/use-modal-keyboard-events';
import { Icon, Icons } from '::shared-components/icon';
import { TransitionWrapper } from '::shared-components/transition-wrapper';
import { EventHandler } from 'react';

export type ErrorModalProps = {
  error: Error;
  onClose: EventHandler<undefined>;
};
const ErrorModal: React.FC<ErrorModalProps & { style }> = ({
  error,
  onClose,
  style,
}) => {
  useModalKeyboardEvents({
    onCloseModal: onClose,
    modalSelector: `.${modErrorModal.errorModal}`,
  });
  return (
    <animated.div
      className={modErrorModal.errorModal}
      style={{
        ...style,
        transform: style.xyz.interpolate(
          (x, y, z) => `scale(${z}) translate3d(${x}px,${y}px,0)`,
        ),
      }}
    >
      <Icon
        name={Icons.material.warning}
        className={`${modErrorModal.errorModal__icon}`}
        extraLarge={true}
      />
      <span className={modErrorModal.errorModal__body}>
        <span className={`${modErrorModal.errorModal__header}`}>
          Something went wrong
        </span>
        <span className={`${modErrorModal.errorModal__message}`}>
          {error?.message || ''}
        </span>
      </span>
      <ButtonSquare
        className={`${modErrorModal.errorModal__dismissButton}`}
        onClick={onClose}
        lazyAutoFocus={300}
      >
        Dismiss
      </ButtonSquare>
    </animated.div>
  );
};

const ErrorModalWithTransition: React.FC<ErrorModalProps> = ({
  error,
  onClose,
}) => {
  return (
    <TransitionWrapper
      Component={ErrorModal}
      show={Boolean(error)}
      transitionValues={{
        from: { opacity: 0, xyz: [0, -25, 0.5] },
        enter: { opacity: 1, xyz: [0, 0, 1] },
        leave: { opacity: 0, xyz: [0, -25, 1] },
      }}
      componentProps={{
        onClose,
        error,
      }}
      scrimProps={{ errorModal: true }}
    />
  );
};
export default ErrorModalWithTransition;

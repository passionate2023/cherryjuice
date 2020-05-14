import { modAlertModal } from '::sass-modules/index';
import * as React from 'react';
import { EventHandler, ReactNode } from 'react';
import { useModalKeyboardEvents } from '::hooks/use-modal-keyboard-events';
import { animated } from 'react-spring';
import { TransitionWrapper } from '::shared-components/transition-wrapper';

type TModalWithTransition = {
  onClose: EventHandler<undefined>;
  show: boolean;
};
type TModalWrapper = TModalWithTransition & {
  children: ReactNode;
};

const ModalWrapper: React.FC<TModalWrapper & { style }> = ({
  children,
  onClose,
  style,
}) => {
  useModalKeyboardEvents({
    onCloseModal: onClose,
    modalSelector: `.${modAlertModal.alertModal}`,
  });
  return (
    <>
      <animated.div
        className={modAlertModal.alertModal}
        style={{
          ...style,
          transform: style.xyz.interpolate(
            (x, y, z) => `scale(${z}) translate3d(${x}px,${y}px,0)`,
          ),
        }}
      >
        {children}
      </animated.div>
    </>
  );
};

const ModalWithTransition: React.FC<TModalWithTransition> = ({
  onClose,
  show,
  children,
}) => {
  return (
    <TransitionWrapper<TModalWrapper>
      Component={ModalWrapper}
      show={show}
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
        children,
        show,
      }}
      scrimProps={{ alertModal: true, onClick: onClose }}
    />
  );
};

export { ModalWithTransition };

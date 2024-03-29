import * as React from 'react';
import { ReactNode } from 'react';
import { useModalKeyboardEvents } from '@cherryjuice/shared-helpers';
import { animated } from 'react-spring';
import { TransitionWrapper } from '::root/components/shared-components/transitions/transition-wrapper';

type ComponentWithTransitionProps = {
  onClose: () => void;
  show: boolean;
  transitionValues: any;
  enableModalKeyboardEvents?: boolean;
  useScrim?: boolean;
  className?: string;
};
type ComponentWrapperProps = Pick<
  ComponentWithTransitionProps,
  'onClose' | 'enableModalKeyboardEvents' | 'useScrim' | 'className'
> & {
  children: ReactNode;
};

const ComponentWrapper: React.FC<ComponentWrapperProps & { style }> = ({
  children,
  onClose,
  style,
  className,
}) => {
  const keyboardEventsProps = useModalKeyboardEvents({
    dismiss: onClose,
    focusableElementsSelector: ['a', 'input[type="submit"]'],
  });
  return (
    <>
      <animated.div
        {...keyboardEventsProps}
        className={className}
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

const ComponentWithTransition: React.FC<ComponentWithTransitionProps> = ({
  onClose,
  show,
  children,
  transitionValues,
  enableModalKeyboardEvents = true,
  useScrim = true,
  className,
}) => {
  return (
    <TransitionWrapper<ComponentWrapperProps>
      Component={ComponentWrapper}
      show={show}
      transitionValues={transitionValues}
      componentProps={{
        onClose,
        children,
        enableModalKeyboardEvents,
        className,
      }}
      scrimProps={useScrim ? { alertModal: true, onClick: onClose } : undefined}
    />
  );
};

export { ComponentWithTransition };

import * as React from 'react';
import { useTransition } from 'react-spring';
import { Scrim, ScrimProps } from '::shared-components/scrim';
import { EventHandler } from 'react';

type TTransitionWrapperProps<T> = {
  componentProps: T & {
    onClose: EventHandler<undefined>;
  };
  Component: React.FC<
    T & {
      onClose: EventHandler<undefined>;
      style: any;
    }
  >;
  show: boolean;
  transitionValues: any;
  scrimProps: ScrimProps;
};
const TransitionWrapper = <T,>({
  componentProps,
  scrimProps,
  transitionValues,
  Component,
  show,
}: TTransitionWrapperProps<T>) => {
  const transitions = useTransition(show, null, transitionValues);
  return (
    <>
      {show && <Scrim {...scrimProps} />}
      {transitions.map(
        ({ key, item, props: style }) =>
          item && <Component {...componentProps} style={style} key={key} />,
      )}
    </>
  );
};

export { TransitionWrapper };

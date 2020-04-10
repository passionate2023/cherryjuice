import * as React from 'react';
import { useTransition } from 'react-spring';
import { Scrim, ScrimProps } from '::shared-components/scrim';

type TTransitionWrapperProps<T> = {
  componentProps: T;
  Component: React.FC<
    T & {
      style: any;
    }
  >;
  show: boolean;
  transitionValues: any;
  scrimProps?: ScrimProps;
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
      {show && scrimProps && <Scrim {...scrimProps} />}
      {transitions.map(
        ({ key, item, props: style }) =>
          item && <Component {...componentProps} style={style} key={key} />,
      )}
    </>
  );
};

export { TransitionWrapper };

import * as React from 'react';
import { useTransition } from 'react-spring';
import {
  Scrim,
  ScrimProps,
} from '::root/components/shared-components/scrim/scrim';

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
  show,
  transitionValues,
  Component,
  componentProps,
  scrimProps,
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

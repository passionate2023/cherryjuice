import * as React from 'react';
import { useTransition } from 'react-spring';
import { Scrim } from '::shared-components/scrim';

type TTransitionWrapperProps = {
  componentProps: any & {
    onClose: Function;
  };
  scrimProps?: any;
  transitionValues: any;
  show: boolean;
  Component: React.FC<any>;
};
const TransitionWrapper: React.FC<TTransitionWrapperProps> = ({
  componentProps,
  scrimProps,
  transitionValues,
  Component,
  show
}) => {
  const transitions = useTransition(
    show,
    null,
    transitionValues,
  );
  return (
    <>
      {show && (
        <Scrim onClick={componentProps.onClose} {...scrimProps} />
      )}
      {transitions.map(
        ({ key, item, props: style }) =>
          item && <Component {...componentProps} style={style} key={key} />,
      )}
    </>
  );
};

export { TransitionWrapper };

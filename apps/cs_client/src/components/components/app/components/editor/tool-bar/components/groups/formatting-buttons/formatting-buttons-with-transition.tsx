import * as React from 'react';
import { TransitionWrapper } from '::shared-components/transitions/transition-wrapper';
import {
  FormattingButtons,
  FormattingButtonsProps,
} from '::app/components/editor/tool-bar/components/groups/formatting-buttons/formatting-buttons';

export const FormattingButtonsWithTransition: React.FC<FormattingButtonsProps & {
  show: boolean;
}> = ({ show, children }) => {
  return (
    <TransitionWrapper<FormattingButtonsProps>
      Component={FormattingButtons}
      show={show}
      transitionValues={{
        from: { opacity: 1, xyz: [-500, 0, 0] },
        enter: { opacity: 1, xyz: [0, 0, 0] },
        leave: { opacity: 1, xyz: [-1000, 0, 0] },
        config: {
          tension: 275,
          friction: 25,
        },
      }}
      componentProps={{ children }}
    />
  );
};

export const formattingBarUnmountAnimationDelay = (): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, 100));

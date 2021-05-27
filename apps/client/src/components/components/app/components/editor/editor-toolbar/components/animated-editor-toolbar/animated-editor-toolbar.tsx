import * as React from 'react';
import { TransitionWrapper } from '::shared-components/transitions/transition-wrapper';
import { StaticEditorToolbar } from '::app/components/editor/editor-toolbar/components/static-editor-toolbar/static-editor-toolbar';

export const AnimatedEditorToolbar: React.FC<{
  show: boolean;
}> = ({ show, children }) => {
  return (
    <TransitionWrapper
      Component={StaticEditorToolbar}
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

import * as React from 'react';
import { animated } from 'react-spring';
import { FormattingButtons } from '::app/components/editor/editor-toolbar/components/static-editor-toolbar/components/formatting-buttons/formatting-buttons';
import { UndoRedo } from '::app/components/editor/editor-toolbar/components/static-editor-toolbar/components/undo-redo/undo-redo';
import { Separator } from '::app/components/editor/editor-toolbar/components/separator';
import { Objects } from '::app/components/editor/editor-toolbar/components/static-editor-toolbar/components/objects/objects';
import { joinClassNames } from '@cherryjuice/shared-helpers';
import mod from './static-editor-toolbar.scss';

const StaticEditorToolbar: React.FC<{
  style?: any;
}> = ({ style }) => {
  style = style
    ? {
        ...style,
        transform: style.xyz.interpolate(
          (x, y) => `translate3d(${x}px,${y}px,0)`,
        ),
      }
    : undefined;
  return (
    <animated.div className={mod.formattingButtonsContainer} style={style}>
      <div
        className={joinClassNames([mod.formattingButtons, mod.toolBar__group])}
      >
        <UndoRedo />
        <Separator />
      </div>
      <div
        className={joinClassNames([
          mod.formattingButtons,
          mod.toolBar__group,
          mod.formattingButtonsScrollable,
        ])}
      >
        <FormattingButtons />
        <Separator />
        <Objects />
      </div>
    </animated.div>
  );
};

export { StaticEditorToolbar };

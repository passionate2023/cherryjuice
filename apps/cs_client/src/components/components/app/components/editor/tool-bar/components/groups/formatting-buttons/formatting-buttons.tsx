import * as React from 'react';
import { modToolbar } from '::sass-modules';
import { animated } from 'react-spring';
import { Buttons } from '::app/components/editor/tool-bar/components/groups/formatting-buttons/components/buttons';
import { UndoRedo } from '::app/components/editor/tool-bar/components/groups/main-buttons/undo-redo/undo-redo';
import { Separator } from '::app/components/editor/tool-bar/components/separator';
import mod from './formatting-buttons.scss';
import { Objects } from '::app/components/editor/tool-bar/components/groups/objects/objects';
export type FormattingButtonsProps = Record<string, never>;

const FormattingButtons: React.FC<
  FormattingButtonsProps & {
    style?: any;
  }
> = ({ style }) => {
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
      <div className={mod.formattingButtons + ' ' + modToolbar.toolBar__group}>
        <UndoRedo />
        <Separator />
      </div>
      <div className={mod.dropDownContainer}>
        <div
          className={mod.formattingButtons + ' ' + modToolbar.toolBar__group}
        >
          <Buttons />
          <Separator />
          <Objects />
        </div>
      </div>
    </animated.div>
  );
};

export { FormattingButtons };

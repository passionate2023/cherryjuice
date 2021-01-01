import * as React from 'react';
import { modToolbar } from '::sass-modules';
import { animated } from 'react-spring';
import { Buttons } from '::app/components/editor/tool-bar/components/groups/formatting-buttons/components/buttons';

export type FormattingButtonsProps = {};

const FormattingButtons: React.FC<
  FormattingButtonsProps & {
    style?: any;
  }
> = ({ style, children }) => {
  return style ? (
    <animated.div
      className={modToolbar.toolBar__groupFormattingContainer}
      style={{
        ...style,
        transform: style.xyz.interpolate(
          (x, y) => `translate3d(${x}px,${y}px,0)`,
        ),
      }}
    >
      <div
        className={
          modToolbar.toolBar__groupFormatting + ' ' + modToolbar.toolBar__group
        }
      >
        <Buttons />
        {children}
      </div>
    </animated.div>
  ) : (
    <div className={modToolbar.toolBar__groupFormattingContainer}>
      <div
        className={
          modToolbar.toolBar__groupFormatting + ' ' + modToolbar.toolBar__group
        }
      >
        <Buttons />
        {children}
      </div>
    </div>
  );
};

export { FormattingButtons };

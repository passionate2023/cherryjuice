import * as React from 'react';
import { ToolbarButton } from '::app/editor/tool-bar/tool-bar-button';
import { execK } from '::helpers/execK';
import { ColorInput } from '::app/editor/tool-bar/groups/formatting-buttons/color-input';
import { commands } from '::helpers/hotkeys/commands';
import { modToolbar } from '::sass-modules/index';
import { Icon } from '::shared-components/icon';
import { TransitionWrapper } from '::shared-components/transition-wrapper';
import { animated } from 'react-spring';

type Props = {};

const Buttons = () => (
  <>
    {commands.tagsAndStyles.map(({ icon, execCommandArguments }, i) => (
      <ToolbarButton
        key={i}
        onClick={() =>
          execK({
            tagName: execCommandArguments.tagName,
            // @ts-ignore
            style: execCommandArguments?.style,
            // @ts-ignore
            command: execCommandArguments?.command,
          })
        }
        className={modToolbar.toolBar__iconStrictWidth}
      >
        <Icon name={icon} small={true} />
      </ToolbarButton>
    ))}
    {commands.colors.map(({ icon, label, cssProperty, inputId }) => (
      <ColorInput
        key={label}
        icon={icon}
        {...{ label, cssProperty, inputId }}
      />
    ))}
    {commands.misc.map(({ icon, execCommandArguments }, i) => (
      <ToolbarButton
        key={i}
        onClick={() =>
          execK({
            tagName: execCommandArguments.tagName,
            // @ts-ignore
            style: execCommandArguments?.style,
            // @ts-ignore
            command: execCommandArguments?.command,
          })
        }
        className={modToolbar.toolBar__iconStrictWidth}
      >
        <Icon name={icon} small={true} />
      </ToolbarButton>
    ))}
  </>
);

const FormattingButtons: React.FC<Props & {
  style?: any;
}> = ({ style }) => {
  return style ? (
    <animated.div
      className={
        modToolbar.toolBar__groupFormatting + ' ' + modToolbar.toolBar__group
      }
      style={{
        ...style,
        transform: style.xyz.interpolate(
          (x, y) => `translate3d(${x}px,${y}px,0)`,
        ),
      }}
    >
      <Buttons />
    </animated.div>
  ) : (
    <div
      className={
        modToolbar.toolBar__groupFormatting + ' ' + modToolbar.toolBar__group
      }
    >
      <Buttons />
    </div>
  );
};
const FormattingButtonsWithTransition: React.FC<Props & { show: boolean }> = ({
  show,
}) => {
  return (
    <TransitionWrapper<Props>
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
      componentProps={{}}
    />
  );
};
const formattingBarUnmountAnimationDelay = (): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, 100))

export {
  FormattingButtons,
  FormattingButtonsWithTransition,
  formattingBarUnmountAnimationDelay,
};

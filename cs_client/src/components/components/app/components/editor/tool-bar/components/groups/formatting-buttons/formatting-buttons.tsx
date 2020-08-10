import * as React from 'react';
import { ToolbarButton } from '::root/components/app/components/editor/tool-bar/components/tool-bar-button/tool-bar-button';
import { execK } from '::helpers/editing/execK';
import { ColorInput } from '::root/components/app/components/editor/tool-bar/components/groups/formatting-buttons/color-input';
import { modToolbar } from '::sass-modules';
import { Icon } from '::root/components/shared-components/icon/icon';
import { TransitionWrapper } from '::root/components/shared-components/transitions/transition-wrapper';
import { animated } from 'react-spring';
import { formattingHotKeys } from '::helpers/hotkeys/combinations/formatting';

import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::store/store';

const mapState = (state: Store) => ({
  selectedNode_id: state.document.selectedNode.node_id,
  documentId: state.document.documentId,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};

const Buttons: React.FC<PropsFromRedux> = ({ selectedNode_id, documentId }) => {
  const disabled = !documentId || !selectedNode_id;
  return (
    <>
      {formattingHotKeys.tagsAndStyles.map(
        ({ icon, execCommandArguments }, i) => (
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
            disabled={disabled}
          >
            <Icon name={icon} />
          </ToolbarButton>
        ),
      )}
      {formattingHotKeys.colors.map(({ icon, label, cssProperty, inputId }) => (
        <ColorInput
          key={label}
          icon={icon}
          {...{ label, cssProperty, inputId }}
          disabled={disabled}
        />
      ))}
      {formattingHotKeys.misc.map(({ icon, execCommandArguments }, i) => (
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
          disabled={disabled}
        >
          <Icon name={icon} />
        </ToolbarButton>
      ))}
    </>
  );
};
const ConnectedButtons = connector(Buttons);
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
      <ConnectedButtons />
    </animated.div>
  ) : (
    <div
      className={
        modToolbar.toolBar__groupFormatting + ' ' + modToolbar.toolBar__group
      }
    >
      <ConnectedButtons />
    </div>
  );
};
const FormattingButtonsWithTransition: React.FC<Props & {
  show: boolean;
}> = ({ show }) => {
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
  new Promise(resolve => setTimeout(resolve, 100));

export {
  FormattingButtons,
  FormattingButtonsWithTransition,
  formattingBarUnmountAnimationDelay,
};

import * as React from 'react';
import { ToolbarButton } from '::root/components/app/components/editor/tool-bar/components/tool-bar-button/tool-bar-button';
import { execK } from '::helpers/editing/execK';
import { ColorInput } from '::root/components/app/components/editor/tool-bar/components/groups/formatting-buttons/components/color-input';
import { modToolbar } from '::sass-modules';
import { Icon } from '::root/components/shared-components/icon/icon';
import { TransitionWrapper } from '::root/components/shared-components/transitions/transition-wrapper';
import { animated } from 'react-spring';
import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::store/store';
import { HotKeyActionType } from '::helpers/hotkeys/types';
import { formattingHotkeysProps } from '::helpers/hotkeys/hot-key-props.ts/formatting-props';

const mapState = (state: Store) => ({
  selectedNode_id: state.document.selectedNode.node_id,
  documentId: state.document.documentId,
  formattingHotKeys: state.auth.settings.hotKeys.formatting.hotkeys,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};

const Buttons: React.FC<PropsFromRedux> = ({
  selectedNode_id,
  documentId,
  formattingHotKeys,
}) => {
  const disabled = !documentId || !selectedNode_id;
  return (
    <>
      {formattingHotKeys.map(hotKey =>
        hotKey.type === HotKeyActionType.FG_COLOR ||
        hotKey.type === HotKeyActionType.BG_COLOR ? (
          <ColorInput key={hotKey.type} hotKey={hotKey} disabled={disabled} />
        ) : (
          <ToolbarButton
            key={hotKey.type}
            onClick={() =>
              execK(formattingHotkeysProps[hotKey.type].execCommandArguments)
            }
            className={modToolbar.toolBar__iconStrictWidth}
            disabled={disabled}
          >
            <Icon name={formattingHotkeysProps[hotKey.type].icon} />
          </ToolbarButton>
        ),
      )}
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

import { Icons } from '::root/components/shared-components/icon/icon';
import { HotKeyActionType } from '@cherryjuice/graphql-types';
import { ExecKProps } from '@cherryjuice/editor';
import { paneLine } from '@cherryjuice/editor';
import { deleteLine } from '@cherryjuice/editor';
import { ExecKCommand } from '@cherryjuice/editor';

export type FormattingHotProps = {
  name?: string;
} & (
  | {
      icon: string;
      execCommandArguments: ExecKProps;
    }
  | { callback: () => void }
);

export const formattingHotkeysProps: { [key: string]: FormattingHotProps } = {
  [HotKeyActionType.BOLD]: {
    icon: Icons.material.bold,
    execCommandArguments: { tagName: 'strong' },
    name: 'bold',
  },
  [HotKeyActionType.ITALIC]: {
    icon: Icons.material.italic,
    execCommandArguments: { tagName: 'em' },
    name: 'italic',
  },
  [HotKeyActionType.UNDERLINE]: {
    icon: Icons.material.underline,
    execCommandArguments: {
      style: { property: 'text-decoration', value: 'underline' },
    },
    name: 'underline',
  },
  [HotKeyActionType.LINE_THROUGH]: {
    icon: Icons.material.strikethrough,
    execCommandArguments: {
      style: { property: 'text-decoration', value: 'line-through' },
    },
  },

  [HotKeyActionType.H1]: {
    icon: Icons.material['h1'],
    execCommandArguments: {
      tagName: 'h1',
    },
  },
  [HotKeyActionType.H2]: {
    icon: Icons.material['h2'],
    execCommandArguments: {
      tagName: 'h2',
    },
  },
  [HotKeyActionType.H3]: {
    icon: Icons.material['h3'],
    execCommandArguments: {
      tagName: 'h3',
    },
  },
  [HotKeyActionType.SMALL]: {
    icon: Icons.material.small,
    execCommandArguments: { tagName: 'small' },
  },
  [HotKeyActionType.SUP]: {
    icon: Icons.material.sup,
    execCommandArguments: { tagName: 'sup' },
  },
  [HotKeyActionType.SUB]: {
    icon: Icons.material.sub,
    execCommandArguments: { tagName: 'sub' },
  },
  [HotKeyActionType.MONO]: {
    icon: Icons.material.mono,
    execCommandArguments: { tagName: 'code' },
  },
  [HotKeyActionType.JUSTIFY_LEFT]: {
    icon: Icons.material['justify-left'],
    execCommandArguments: { command: ExecKCommand.justifyLeft },
  },
  [HotKeyActionType.JUSTIFY_CENTER]: {
    icon: Icons.material['justify-center'],
    execCommandArguments: { command: ExecKCommand.justifyCenter },
  },
  [HotKeyActionType.JUSTIFY_RIGHT]: {
    icon: Icons.material['justify-right'],
    execCommandArguments: { command: ExecKCommand.justifyRight },
  },
  [HotKeyActionType.JUSTIFY_FILL]: {
    icon: Icons.material['justify-fill'],
    execCommandArguments: { command: ExecKCommand.justifyFill },
  },
  [HotKeyActionType.FOREGROUND_COLOR]: {
    icon: Icons.material.foreground,
    execCommandArguments: {
      style: { property: `color`, value: '' },
    },
  },
  [HotKeyActionType.BACKGROUND_COLOR]: {
    icon: Icons.material.background,
    execCommandArguments: {
      style: { property: `background-color`, value: '' },
    },
  },

  [HotKeyActionType.REMOVE_STYLE]: {
    icon: Icons.material['clear-format'],
    execCommandArguments: { command: ExecKCommand.clear, tagName: undefined },
    name: 'remove style',
  },
  [HotKeyActionType.MOVE_LINE_UP]: {
    name: 'move line up',
    callback: paneLine('up'),
  },
  [HotKeyActionType.MOVE_LINE_DOWN]: {
    name: 'move line down',
    callback: paneLine('down'),
  },
  [HotKeyActionType.DELETE_LINE]: {
    name: 'delete line',
    callback: deleteLine,
  },
};

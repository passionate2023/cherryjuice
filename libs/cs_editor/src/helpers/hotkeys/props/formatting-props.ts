import { Icons } from '@cherryjuice/icons';
import { HotKeyActionType } from '@cherryjuice/graphql-types';
import { ExecKProps } from '::helpers/execK';
import { ExecKCommand } from '::helpers/execK/execk-commands';
import { deleteLine } from '::helpers/typing/delete-line/delete-line';
import { paneLine } from '::helpers/typing/pane-line/pane-line';
import { toggleBulletPoint } from '::helpers/lists/bullet-points/toggle-bullet-point';

export type FormattingHotProps = {
  name?: string;
  category?: FormattingButtonCategory;
} & (
  | {
      icon: string;
      execCommandArguments: ExecKProps;
    }
  | { callback: () => void }
);
export enum FormattingButtonCategory {
  primary = 'primary',
  secondary = 'secondary',
  tertiary = 'tertiary',
  headers = 'headers',
  justification = 'justification',
  colors = 'colors',
}
export const formattingHotkeysProps: { [key: string]: FormattingHotProps } = {
  [HotKeyActionType.BOLD]: {
    icon: Icons.material.bold,
    execCommandArguments: { tagName: 'strong' },
    name: 'bold',
    category: FormattingButtonCategory.primary,
  },
  [HotKeyActionType.ITALIC]: {
    icon: Icons.material.italic,
    execCommandArguments: { tagName: 'em' },
    name: 'italic',
    category: FormattingButtonCategory.primary,
  },
  [HotKeyActionType.UNDERLINE]: {
    icon: Icons.material.underline,
    execCommandArguments: {
      style: { property: 'text-decoration', value: 'underline' },
    },
    name: 'underline',
    category: FormattingButtonCategory.primary,
  },
  [HotKeyActionType.LINE_THROUGH]: {
    icon: Icons.material.strikethrough,
    execCommandArguments: {
      style: { property: 'text-decoration', value: 'line-through' },
    },
    name: 'line through',
    category: FormattingButtonCategory.primary,
  },

  [HotKeyActionType.H1]: {
    icon: Icons.material['h1'],
    execCommandArguments: {
      tagName: 'h1',
    },
    name: 'header 1',
    category: FormattingButtonCategory.headers,
  },
  [HotKeyActionType.H2]: {
    icon: Icons.material['h2'],
    execCommandArguments: {
      tagName: 'h2',
    },
    name: 'header 2',
    category: FormattingButtonCategory.headers,
  },
  [HotKeyActionType.H3]: {
    icon: Icons.material['h3'],
    execCommandArguments: {
      tagName: 'h3',
    },
    name: 'header 3',
    category: FormattingButtonCategory.headers,
  },
  [HotKeyActionType.SMALL]: {
    icon: Icons.material.small,
    execCommandArguments: { tagName: 'small' },
    category: FormattingButtonCategory.secondary,
    name: 'small',
  },
  [HotKeyActionType.SUP]: {
    icon: Icons.material.sup,
    execCommandArguments: { tagName: 'sup' },
    category: FormattingButtonCategory.secondary,
    name: 'sup',
  },
  [HotKeyActionType.SUB]: {
    icon: Icons.material.sub,
    execCommandArguments: { tagName: 'sub' },
    category: FormattingButtonCategory.secondary,
    name: 'sub',
  },
  [HotKeyActionType.MONO]: {
    icon: Icons.material.mono,
    execCommandArguments: { tagName: 'code' },
    category: FormattingButtonCategory.secondary,
    name: 'monospace',
  },
  [HotKeyActionType.JUSTIFY_LEFT]: {
    icon: Icons.material['justify-left'],
    execCommandArguments: { command: ExecKCommand.justifyLeft },
    category: FormattingButtonCategory.justification,
    name: 'justify left',
  },
  [HotKeyActionType.JUSTIFY_CENTER]: {
    icon: Icons.material['justify-center'],
    execCommandArguments: { command: ExecKCommand.justifyCenter },
    category: FormattingButtonCategory.justification,
    name: 'justify center',
  },
  [HotKeyActionType.JUSTIFY_RIGHT]: {
    icon: Icons.material['justify-right'],
    execCommandArguments: { command: ExecKCommand.justifyRight },
    category: FormattingButtonCategory.justification,
    name: 'justify right',
  },
  [HotKeyActionType.JUSTIFY_FILL]: {
    icon: Icons.material['justify-fill'],
    execCommandArguments: { command: ExecKCommand.justifyFill },
    category: FormattingButtonCategory.justification,
    name: 'justify fill',
  },
  [HotKeyActionType.FOREGROUND_COLOR]: {
    icon: Icons.material.foreground,
    execCommandArguments: {
      style: { property: `color`, value: '' },
    },
    category: FormattingButtonCategory.colors,
    name: 'foreground color',
  },
  [HotKeyActionType.BACKGROUND_COLOR]: {
    icon: Icons.material.background,
    execCommandArguments: {
      style: { property: `background-color`, value: '' },
    },
    category: FormattingButtonCategory.colors,
    name: 'background color',
  },

  [HotKeyActionType.REMOVE_STYLE]: {
    icon: Icons.material['clear-format'],
    execCommandArguments: { command: ExecKCommand.clear, tagName: undefined },
    name: 'remove style',
    category: FormattingButtonCategory.tertiary,
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
  [HotKeyActionType.TOGGLE_BULLET_POINT]: {
    name: 'toggle bullet point',
    callback: toggleBulletPoint,
  },
};

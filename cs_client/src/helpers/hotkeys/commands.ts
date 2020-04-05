import { ExecKCommand } from '::helpers/execK';
import { Icons } from '../../components/shared-components/icon';

const colors = [
  {
    name: 'change foreground color',
    label: 'fg',
    icon: Icons.material.foreground,
    cssProperty: 'color',
    hotKey: { key: ' ', ctrlKey: true, shiftKey: true },
    inputId: 'fg-color-input',
  },
  {
    name: 'change background color',
    label: 'bg',
    icon: Icons.material.background,
    cssProperty: 'background-color',
    hotKey: { key: ' ', ctrlKey: true, altKey: true },
    inputId: 'bg-color-input',
  },
];

const tagsAndStyles = [
  {
    name: 'toggle bold property',
    button: {
      style: {},
      label: 'b',
    },
    icon: Icons.material.bold,
    execCommandArguments: { tagName: 'strong', style: undefined },
    hotKey: { key: 'b', ctrlKey: true },
  },
  {
    icon: Icons.material.italic,
    name: 'toggle italic property',
    button: { style: {}, label: 'i' },
    execCommandArguments: { tagName: 'em' },
    hotKey: { key: 'i', ctrlKey: true },
  },
  {
    icon: Icons.material.underline,
    name: 'toggle underline property',
    button: {
      label: 'a',
      style: { textDecoration: 'underline' },
    },
    execCommandArguments: {
      style: { property: 'text-decoration', value: 'underline' },
    },
    hotKey: { key: ' ', ctrlKey: true },
  },
  {
    icon: Icons.material.strikethrough,
    name: 'toggle line-through property',
    button: {
      label: 'a',
      style: { textDecoration: 'line-through' },
    },
    execCommandArguments: {
      style: { property: 'text-decoration', value: 'line-through' },
    },
    hotKey: { key: 'e', ctrlKey: true },
  },
  ...['h1', 'h2', 'h3'].map((tagName, i) => ({
    icon: Icons.material[tagName],
    name: `toggle ${tagName} property`,
    button: {
      style: {},
      label: tagName,
    },
    execCommandArguments: { tagName },
    hotKey: { code: `Digit${i + 1}`, ctrlKey: true },
  })),
  {
    icon: Icons.material.small,
    name: 'toggle small property',
    button: {
      style: {},
      label: 'sm',
    },
    execCommandArguments: { tagName: 'small' },
    hotKey: { code: `Digit${0}`, ctrlKey: true },
  },
  {
    icon: Icons.material.sup,
    name: 'toggle superscript property',
    button: {
      style: {},
      label: 'sp',
    },
    execCommandArguments: { tagName: 'sup' },
    hotKey: { key: `ArrowUp`, ctrlKey: true },
  },
  {
    icon: Icons.material.sub,
    name: 'toggle subscript property',
    button: {
      style: {},
      label: 'sb',
    },
    execCommandArguments: { tagName: 'sub' },
    hotKey: { key: `ArrowDown`, ctrlKey: true },
  },
  {
    icon: Icons.material.mono,
    name: 'toggle monospace property',
    button: {
      style: {},
      label: 'm',
    },
    execCommandArguments: {
      tagName: 'code',

      // style: { property: 'font-family', value: 'monospace' },
    },
    hotKey: { key: `m`, ctrlKey: true },
  },
  {
    icon: Icons.material['justify-left'],
    name: 'justify left',
    button: {
      style: {},
      label: 'jl',
    },
    execCommandArguments: { command: ExecKCommand.justifyLeft },
  },
  {
    icon: Icons.material['justify-center'],
    name: 'justify center',
    button: {
      style: {},
      label: 'jc',
    },
    execCommandArguments: { command: ExecKCommand.justifyCenter },
  },
  {
    icon: Icons.material['justify-right'],
    name: 'justify right',
    button: {
      style: {},
      label: 'jr',
    },
    execCommandArguments: { command: ExecKCommand.justifyRight },
  },
];
const misc = [
  {
    tagName: undefined,
    icon: Icons.material['clear-format'],
    name: 'remove style',
    button: {
      style: {},
      label: 'c',
    },
    execCommandArguments: { command: ExecKCommand.clear },
    hotKey: { key: `r`, altKey: true },
  },
];
const commands = { tagsAndStyles, colors, misc };

export { commands };

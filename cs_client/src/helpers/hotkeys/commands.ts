import { ExecKCommand } from '::helpers/execK';

const colors = [
  {
    name: 'change foreground color',
    label: 'fg',
    cssProperty: 'color',
    hotKey: { key: ' ', ctrlKey: true, shiftKey: true },
    inputId: 'fg-color-input',
  },
  {
    name: 'change background color',
    label: 'bg',
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
    execCommandArguments: { tagName: 'strong', style: undefined },
    hotKey: { key: 'b', ctrlKey: true },
  },
  {
    name: 'toggle italic property',
    button: { style: {}, label: 'i' },
    execCommandArguments: { tagName: 'em' },
    hotKey: { key: 'i', ctrlKey: true },
  },
  {
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
    name: `toggle ${tagName} property`,
    button: {
      style: {},
      label: tagName,
    },
    execCommandArguments: { tagName },
    hotKey: { code: `Digit${i + 1}`, ctrlKey: true },
  })),
  {
    name: 'toggle small property',
    button: {
      style: {},
      label: 'sm',
    },
    execCommandArguments: { tagName: 'small' },
    hotKey: { code: `Digit${0}`, ctrlKey: true },
  },
  {
    name: 'toggle superscript property',
    button: {
      style: {},
      label: 'sp',
    },
    execCommandArguments: { tagName: 'sup' },
    hotKey: { key: `ArrowUp`, ctrlKey: true },
  },
  {
    name: 'toggle subscript property',
    button: {
      style: {},
      label: 'sb',
    },
    execCommandArguments: { tagName: 'sub' },
    hotKey: { key: `ArrowDown`, ctrlKey: true },
  },
  {
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
    name: 'justify left',
    button: {
      style: {},
      label: 'jl',
    },
    execCommandArguments: { command: ExecKCommand.justifyLeft },
  },
  {
    name: 'justify center',
    button: {
      style: {},
      label: 'jc',
    },
    execCommandArguments: { command: ExecKCommand.justifyCenter },
  },
  {
    name: 'justify right',
    button: {
      style: {},
      label: 'jr',
    },
    execCommandArguments: { command: ExecKCommand.justifyRight },
  },
  {
    name: 'remove style',
    button: {
      style: {},
      label: 'c',
    },
    execCommandArguments: { command: ExecKCommand.clear },
    hotKey: { key: `r`, altKey: true },
  },
];
const commands = { tagsAndStyles, colors };

export { commands };

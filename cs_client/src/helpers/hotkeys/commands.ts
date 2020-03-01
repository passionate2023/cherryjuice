import { ExecKCommand } from '::helpers/execK';

const colors = [
  {
    label: 'fg',
    cssProperty: 'color',
    hotKey: { key: ' ', ctrlKey: true, shiftKey: true },
    inputId: 'fg-color-input'
  },
  {
    label: 'bg',
    cssProperty: 'background-color',
    hotKey: { key: ' ', ctrlKey: true, altKey: true },
    inputId: 'bg-color-input'
  }
];

const tagsAndStyles = [
  {
    button: {
      style: {},
      label: 'b'
    },
    execCommandArguments: { tagName: 'strong', style: undefined },
    hotKey: { key: 'b', ctrlKey: true }
  },
  {
    button: { style: {}, label: 'i' },
    execCommandArguments: { tagName: 'em' },
    hotKey: { key: 'i', ctrlKey: true }
  },
  {
    button: {
      label: 'a',
      style: { textDecoration: 'underline' }
    },
    execCommandArguments: {
      style: { property: 'text-decoration', value: 'underline' }
    },
    hotKey: { key: ' ', ctrlKey: true }
  },
  {
    button: {
      label: 'a',
      style: { textDecoration: 'line-through' }
    },
    execCommandArguments: {
      style: { property: 'text-decoration', value: 'line-through' }
    },
    hotKey: { key: 'e', ctrlKey: true }
  },
  ...['h1', 'h2', 'h3'].map((tagName, i) => ({
    button: {
      style: {},
      label: tagName
    },
    execCommandArguments: { tagName },
    hotKey: { code: `Digit${i + 1}`, ctrlKey: true }
  })),
  {
    button: {
      style: {},
      label: 'sm'
    },
    execCommandArguments: { tagName: 'small' },
    hotKey: { code: `Digit${0}`, ctrlKey: true }
  },
  {
    button: {
      style: {},
      label: 'sp'
    },
    execCommandArguments: { tagName: 'sup' },
    hotKey: { key: `ArrowUp`, ctrlKey: true }
  },
  {
    button: {
      style: {},
      label: 'sb'
    },
    execCommandArguments: { tagName: 'sub' },
    hotKey: { key: `ArrowDown`, ctrlKey: true }
  },
  {
    button: {
      style: {},
      label: 'm'
    },
    execCommandArguments: { tagName: 'code' },
    hotKey: { key: `m`, ctrlKey: true }
  },
  {
    button: {
      style: {},
      label: 'c'
    },
    execCommandArguments: { command: ExecKCommand.clear },
    hotKey: { key: `r`, altKey: true }
  },
  {
    button: {
      style: {},
      label: 'jl'
    },
    execCommandArguments: { command: ExecKCommand.justifyLeft }
  },
  {
    button: {
      style: {},
      label: 'jc'
    },
    execCommandArguments: { command: ExecKCommand.justifyCenter }
  },
  {
    button: {
      style: {},
      label: 'jr'
    },
    execCommandArguments: { command: ExecKCommand.justifyRight }
  }
];

const commands = { tagsAndStyles, colors };

export { commands };

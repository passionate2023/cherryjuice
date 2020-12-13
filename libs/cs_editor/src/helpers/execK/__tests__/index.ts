import { execK } from '../index';
import { testSamples, TTestSample } from './__data__';
import { HotKeyActionType } from '@cherryjuice/graphql-types';
import { ExecKCommand } from '../execk-commands';

const formattingHotkeysProps = {
  [HotKeyActionType.BOLD]: {
    execCommandArguments: { tagName: 'strong' },
    name: 'bold',
  },
  [HotKeyActionType.ITALIC]: {
    execCommandArguments: { tagName: 'em' },
    name: 'italic',
  },
  [HotKeyActionType.UNDERLINE]: {
    execCommandArguments: {
      style: { property: 'text-decoration', value: 'underline' },
    },
    name: 'underline',
  },
  [HotKeyActionType.LINE_THROUGH]: {
    execCommandArguments: {
      style: { property: 'text-decoration', value: 'line-through' },
    },
  },

  [HotKeyActionType.H1]: {
    execCommandArguments: {
      tagName: 'h1',
    },
  },
  [HotKeyActionType.H2]: {
    execCommandArguments: {
      tagName: 'h2',
    },
  },
  [HotKeyActionType.H3]: {
    execCommandArguments: {
      tagName: 'h3',
    },
  },
  [HotKeyActionType.SMALL]: {
    execCommandArguments: { tagName: 'small' },
  },
  [HotKeyActionType.SUP]: {
    execCommandArguments: { tagName: 'sup' },
  },
  [HotKeyActionType.SUB]: {
    execCommandArguments: { tagName: 'sub' },
  },
  [HotKeyActionType.MONO]: {
    execCommandArguments: { tagName: 'code' },
  },
  [HotKeyActionType.JUSTIFY_LEFT]: {
    execCommandArguments: { command: ExecKCommand.justifyLeft },
  },
  [HotKeyActionType.JUSTIFY_CENTER]: {
    execCommandArguments: { command: ExecKCommand.justifyCenter },
  },
  [HotKeyActionType.JUSTIFY_RIGHT]: {
    execCommandArguments: { command: ExecKCommand.justifyRight },
  },
  [HotKeyActionType.JUSTIFY_FILL]: {
    execCommandArguments: { command: ExecKCommand.justifyFill },
  },
  [HotKeyActionType.FOREGROUND_COLOR]: {
    execCommandArguments: {
      style: { property: `color`, value: '' },
    },
  },
  [HotKeyActionType.BACKGROUND_COLOR]: {
    execCommandArguments: {
      style: { property: `background-color`, value: '' },
    },
  },

  [HotKeyActionType.REMOVE_STYLE]: {
    execCommandArguments: { command: ExecKCommand.clear, tagName: undefined },
    name: 'remove style',
  },
};

beforeAll(() => {
  // @ts-ignore
  Object.defineProperty(global.Element.prototype, 'innerText', {
    get() {
      return this.textContent;
    },
    configurable: true, // make it so that it doesn't blow chunks on re-running tests with things like --watch
  });
});

jest.mock('../steps/restore-selection', () => {
  return {
    restoreSelection: jest.fn(() => undefined),
  };
});

const test = (
  { meta: { name }, input: { endOffset, startOffset, outerHTML } }: TTestSample,
  cmd,
) => {
  it(name + ' ' + JSON.stringify(cmd), () => {
    document.body.innerHTML = outerHTML;
    const startElement = document.querySelector('[start-element="true"]');
    const endElement = document.querySelector('[end-element="true"]');
    execK({
      ...cmd,
      selection: { endOffset, startOffset, startElement, endElement },
    });
    const res = document.querySelector('#rich-text');
    expect(res).toMatchSnapshot();
  });
};

describe('execK snapshot tests', () => {
  const predicate = filter => ({ meta: { name } }) =>
    filter ? name === filter : name;
  testSamples.filter(predicate(undefined)).forEach(sample => {
    Object.values(formattingHotkeysProps).forEach(
      ({ execCommandArguments }) => {
        test(sample, execCommandArguments);
      },
    );
  });
});

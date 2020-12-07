import { execK } from '::editor/helpers/execK';
import {
  testSamples,
  TTestSample,
} from '::editor/helpers/execK/__tests__/__data__';
import { formattingHotkeysProps } from '::helpers/hotkeys/hot-key-props/formatting-props';

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

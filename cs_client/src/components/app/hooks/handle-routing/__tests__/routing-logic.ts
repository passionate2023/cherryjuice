import { navigate } from '::root/router/navigate';
import { routingLogic } from '::app/hooks/handle-routing/helpers/routing-logic';
jest.mock('::root/router/navigate', () => {
  return {
    navigate: {
      document: jest.fn(),
      home: jest.fn(),
    },
  };
});
describe('app component routing logic', () => {
  beforeEach(() => {
    // @ts-ignore
    navigate.document.mockReset();
    // @ts-ignore
    navigate.home.mockReset();
  });
  it('/  x -> x', () => {
    const test = {
      pathname: '/',
      documentId: 'x',
    };
    routingLogic(test);
    expect(navigate.document).toHaveBeenCalledWith(test.documentId);
    expect(navigate.home).not.toHaveBeenCalled();
  });
  it('x z -> z', () => {
    const test = {
      pathname: '/document/x',
      documentId: 'z',
    };
    routingLogic(test);
    expect(navigate.document).toHaveBeenCalledWith(test.documentId);
    expect(navigate.home).not.toHaveBeenCalled();
  });
  it('x empty (first) -> -', () => {
    const test = {
      pathname: '/document/x',
      documentId: '',
      isFirstCall: true,
    };
    routingLogic(test);
    expect(navigate.document).not.toHaveBeenCalled();
    expect(navigate.home).not.toHaveBeenCalled();
  });
  it('x empty -> /', () => {
    const test = {
      pathname: '/document/x',
      documentId: '',
    };
    routingLogic(test);
    expect(navigate.document).not.toHaveBeenCalled();
    expect(navigate.home).toHaveBeenCalled();
  });
  it('x x -> -', () => {
    const test = {
      pathname: '/document/x',
      documentId: 'x',
    };
    routingLogic(test);
    expect(navigate.document).not.toHaveBeenCalled();
    expect(navigate.home).not.toHaveBeenCalled();
  });
});

import { router } from '::root/router/router';
import { routingLogic } from '::app/hooks/handle-routing/helpers/routing-logic';
jest.mock('::root/router/router', () => {
  return {
    router: {
      document: jest.fn(),
      home: jest.fn(),
    },
  };
});
describe('app component routing logic', () => {
  beforeEach(() => {
    // @ts-ignore
    router.document.mockReset();
    // @ts-ignore
    router.home.mockReset();
  });
  it('/  x -> x', () => {
    const test = {
      pathname: '/',
      documentId: 'x',
    };
    routingLogic(test);
    expect(router.document).toHaveBeenCalledWith(test.documentId);
    expect(router.home).not.toHaveBeenCalled();
  });
  it('x z -> z', () => {
    const test = {
      pathname: '/document/x',
      documentId: 'z',
    };
    routingLogic(test);
    expect(router.document).toHaveBeenCalledWith(test.documentId);
    expect(router.home).not.toHaveBeenCalled();
  });
  it('x empty (first) -> -', () => {
    const test = {
      pathname: '/document/x',
      documentId: '',
      isFirstCall: true,
    };
    routingLogic(test);
    expect(router.document).not.toHaveBeenCalled();
    expect(router.home).not.toHaveBeenCalled();
  });
  it('x empty -> /', () => {
    const test = {
      pathname: '/document/x',
      documentId: '',
    };
    routingLogic(test);
    expect(router.document).not.toHaveBeenCalled();
    expect(router.home).toHaveBeenCalled();
  });
  it('x x -> -', () => {
    const test = {
      pathname: '/document/x',
      documentId: 'x',
    };
    routingLogic(test);
    expect(router.document).not.toHaveBeenCalled();
    expect(router.home).not.toHaveBeenCalled();
  });
});

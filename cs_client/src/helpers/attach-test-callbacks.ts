import { documentActionCreators } from '::app/editor/document/reducer/action-creators';

const attachTestCallbacks = () => {
  // @ts-ignore
  window.__testCallbacks = {
    pastedImages: documentActionCreators.pastedImages,
  };
};

export { attachTestCallbacks };

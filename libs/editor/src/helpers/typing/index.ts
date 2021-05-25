import { handleBackSpace } from '::helpers/typing/handle-backspace/handle-backspace';
import { handleEnter } from '::helpers/typing/new-line/handle-enter';
import { handleTab } from '::helpers/typing/indentation/handle-tab';
import { bridge } from '::root/bridge';

const onKeyDown = e => {
  try {
    if (e.keyCode === 9) {
      handleTab(e);
    } else if (e.keyCode === 8) {
      handleBackSpace(e);
    } else if (e.keyCode === 13) {
      handleEnter(e);
    }
  } catch (error) {
    bridge.current.onTypingError(error);
  }
};

export { onKeyDown };

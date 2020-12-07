import { handleBackSpace } from '::editor/helpers/typing/handle-backspace/handle-backspace';
import { handleEnter } from '::editor/helpers/typing/new-line/handle-enter';
import { handleTab } from '::editor/helpers/typing/indentation/handle-tab';
import { bridge } from '::editor/bridge';

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

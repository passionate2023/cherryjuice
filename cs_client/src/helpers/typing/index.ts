import { handleIndentation } from '::helpers/typing/indentation';
import { appActionCreators } from '::app/reducer';
import { handleBackSpace } from './backspace';

const setupKeyboardEvents = () => {
  const editor = document.querySelector('#rich-text');
  editor.onkeydown = e => {
    try {
      if (e.keyCode == 9) {
        handleIndentation(e);
      } else if (e.keyCode == 8) {
        handleBackSpace(e);
      }
    } catch (error) {
      appActionCreators.throwError(error);
      // eslint-disable-next-line no-console
      if (process.env.NODE_ENV === 'development') console.error(error);
    }
  };
};

export { setupKeyboardEvents };

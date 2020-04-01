import { handleIndentation } from '::helpers/typing/indentation';
import { appActions } from '::app/reducer';
import { handleBackSpace } from './backspace';

const setupKeyboardEvents = ({ dispatch }) => {
  const editor = document.querySelector('#rich-text');
  editor.onkeydown = e => {
    try {
      if (e.keyCode == 9) {
        handleIndentation(e);
      } else if (e.keyCode == 8) {
        handleBackSpace(e);
      }
    } catch (error) {
      dispatch({ type: appActions.SET_ERROR, value: error });
    }
  };
};

export { setupKeyboardEvents };

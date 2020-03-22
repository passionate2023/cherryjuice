import { handleIndentation } from '::helpers/typing/indentation';

const setupKeyboardEvents = () => {
  const editor = document.querySelector('#rich-text');
  editor.onkeydown = e => {
    if (e.keyCode == 9) {
      e.preventDefault();
      handleIndentation(e);
    }
  };
};

export { setupKeyboardEvents };

import { handleIndentation } from '::helpers/editing/typing/indentation';
import { handleBackSpace } from './backspace';
import { AlertType } from '::types/react';
import { ac } from '::root/store/store';

const setupTabAndBackspaceHandler = () => {
  const editor: HTMLDivElement = document.querySelector('#rich-text');
  editor.onkeydown = e => {
    try {
      if (e.keyCode == 9) {
        handleIndentation(e);
      } else if (e.keyCode == 8) {
        handleBackSpace(e);
      }
    } catch (error) {
      ac.dialogs.setAlert({
        title:
          e.keyCode == 9
            ? 'Could not perform the indentation'
            : 'Something went wrong',
        description: 'Please submit a bug report',
        type: AlertType.Error,
        error,
      });
    }
  };
};

export { setupTabAndBackspaceHandler };

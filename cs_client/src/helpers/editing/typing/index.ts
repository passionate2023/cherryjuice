import { handleIndentation } from '::helpers/editing/typing/indentation';
import { handleBackSpace } from './backspace';
import { handleEnter } from '::helpers/editing/typing/new-line/handle-enter';
import { ac } from '::store/store';
import { AlertType } from '::types/react';

const onKeyDown = e => {
  try {
    if (e.keyCode === 9) {
      handleIndentation(e);
    } else if (e.keyCode === 8) {
      handleBackSpace(e);
    } else if (e.keyCode === 13) {
      if (process.env.NODE_ENV === 'development')
        // eslint-disable-next-line no-console
        console.log('handling enter', new Date());
      handleEnter(e);
    }
  } catch (error) {
    ac.dialogs.setAlert({
      title:
        e.keyCode == 9
          ? 'Could not perform the action'
          : 'Something went wrong',
      description: 'Please submit a bug report',
      type: AlertType.Error,
      error,
    });
  }
};

export { onKeyDown };

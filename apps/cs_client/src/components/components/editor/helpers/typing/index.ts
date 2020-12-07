import { handleBackSpace } from '::root/components/editor/helpers/typing/handle-backspace/handle-backspace';
import { handleEnter } from '::root/components/editor/helpers/typing/new-line/handle-enter';
import { ac } from '::store/store';
import { AlertType } from '::types/react';
import { handleTab } from '::root/components/editor/helpers/typing/indentation/handle-tab';

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

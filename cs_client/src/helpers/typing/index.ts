import { handleIndentation } from '::helpers/typing/indentation';
import { appActions } from '::app/reducer';

const setupKeyboardEvents = ({dispatch}) => {
  const editor = document.querySelector('#rich-text');
  editor.onkeydown = e => {
    try{

    if (e.keyCode == 9) {
      e.preventDefault();
      handleIndentation(e,);
    }
    }catch(error){
      dispatch({ type: appActions.SET_ERROR, value: error });
    }
  };
};

export { setupKeyboardEvents };

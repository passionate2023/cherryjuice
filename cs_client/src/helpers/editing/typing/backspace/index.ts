import { getCursorPosition } from '::helpers/editing/typing/new-line/helpers/get-cursor-position';
import { getSelection } from '::helpers/editing/execK/steps/get-selection';
import { doBackspace } from '::helpers/editing/typing/backspace/helpers/do-backspace';

const handleBackSpace = e => {
  const selection = getSelection({
    selectAdjacentWordIfNoneIsSelected: false,
  });
  const position = getCursorPosition(selection);
  if (position.afterCodeBox) {
    e.preventDefault();
    doBackspace.codeBox(selection);
  }
};
export { handleBackSpace };

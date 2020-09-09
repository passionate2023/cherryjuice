import { getSelection } from '::helpers/editing/execK/steps/get-selection';
import { getDDOE } from '::helpers/editing/execK/steps/pipe1/ddoes';
import { setTextSelection } from '::helpers/editing/execK/steps/restore-selection';

export const paneLine = (direction: 'up' | 'down') => {
  const up = direction === 'up';
  return () => {
    const selection = getSelection({
      selectAdjacentWordIfNoneIsSelected: false,
    });
    if (selection) {
      const line: HTMLElement = getDDOE(selection.startElement);
      const anchor = up ? line.previousElementSibling : line.nextElementSibling;
      if (anchor) {
        if (up) anchor.before(line);
        else anchor.after(line);
        setTextSelection(selection, true);
      }
    }
  };
};

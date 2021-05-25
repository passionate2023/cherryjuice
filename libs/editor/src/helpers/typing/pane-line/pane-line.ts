import { getSelection } from '::helpers/execK/steps/get-selection';
import { getDDOE } from '::helpers/execK/steps/pipe1/ddoes';
import { setTextSelection } from '::helpers/execK/steps/restore-selection';
import { applyTemporaryStamps } from '::helpers/execK/steps/pipe1/split-selection';

export const paneLine = (direction: 'up' | 'down') => {
  const up = direction === 'up';
  return () => {
    const selection = getSelection({
      selectAdjacentWordIfNoneIsSelected: false,
    });
    if (selection) {
      const line: HTMLElement = getDDOE(selection.startElement);
      const anchor = up ? line.previousElementSibling : line.nextElementSibling;
      applyTemporaryStamps({
        startElement: line,
        endElement: line,
        stampPrefix: 'pn',
        offset: selection.startOffset,
      });
      if (anchor) {
        if (up) anchor.before(line);
        else anchor.after(line);
        setTextSelection(selection, true);
      }
    }
  };
};

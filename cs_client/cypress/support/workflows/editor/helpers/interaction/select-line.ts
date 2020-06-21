import { wait } from '../../../../helpers/cypress-helpers';

type Cursor = {
  lineIndex: number;
  position: 'start';
};

const selectLine = ({ lineIndex }: Cursor) => {
  return cy.window().then(window => {
    const { document } = window;
    const range = document.createRange();
    range.setStart(document.querySelector('#rich-text').children[lineIndex], 0);
    range.collapse(true);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    wait.ms250();
  });
};

export { selectLine };
export { Cursor };

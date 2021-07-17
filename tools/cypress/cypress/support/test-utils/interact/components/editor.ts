import { NodeAst } from '../../../../fixtures/node/generate-node';
import { interact } from '../interact';
import { wait } from '../../../helpers/cypress-helpers';

const typeText = (nodes: NodeAst[], clear = false) => {
  nodes
    .filter(node => node.text)
    .forEach(node => {
      interact.tree.select.node(node);
      clear
        ? cy.get('#rich-text').clear().type(node.text)
        : cy.get('#rich-text').type(node.text);
    });
};

const focus = () => {
  cy.get('#rich-text').focus();
  wait.ms250();
};

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

const editor = {
  focus,
  typeText,
  selectLine,
};

export { editor };
export { Cursor };

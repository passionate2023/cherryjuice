import { wait } from '../../helpers/cypress-helpers';
import { getElementPath } from '../../helpers/dom';
import {
  randomArrayElement,
  removeArrayElement,
} from '../../helpers/javascript-utils';

export const dndNode = ({ tree }) => {
  const sourceLevel = tree[tree.length - 1];
  const newParentLevel = tree[0];
  const targetLevel = tree[1];
  const draggedNode = randomArrayElement(sourceLevel);
  const targetNode = randomArrayElement(newParentLevel);
  cy.findAllByText(draggedNode.name).then(target$ => {
    cy.findAllByText(targetNode.name).then(dragged$ => {
      wait.s1();
      const targetSelector = getElementPath(target$[1], 'tree');
      const draggedSelector = getElementPath(dragged$[1], 'tree');
      cy.get(targetSelector).drag(draggedSelector, { force: true });
      targetNode.children.push(draggedNode);
      draggedNode.parent = targetNode.id;
      removeArrayElement(sourceLevel, draggedNode);
      targetLevel.push(draggedNode);
      const temp = targetLevel.slice();
      targetLevel.splice(0, Infinity);
      targetLevel.push(...temp.sort((a, b) => a.parent.id - b.parent.id));
    });
  });
};

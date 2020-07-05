import { wait } from '../../../helpers/cypress-helpers';
import { getElementPath } from '../../../helpers/dom';
import {
  randomArrayElement,
  removeArrayElement,
} from '../../../helpers/javascript-utils';
import { TreeAst } from '../../../../fixtures/tree/generate-tree';

type DndNodeProps = {
  tree: TreeAst;
};
export const dndNode = ({ tree }: DndNodeProps) => {
  const sourceLevel = tree[tree.length - 1];
  const newParentLevel = tree[0];
  const targetLevel = tree[1];
  const draggedNode = randomArrayElement(sourceLevel);
  const draggedNodeParent = draggedNode.parent;
  const targetNode = randomArrayElement(newParentLevel);
  cy.findAllByText(draggedNode.name).then(target$ => {
    cy.findAllByText(targetNode.name).then(dragged$ => {
      wait.s1();
      const targetSelector = getElementPath(target$[1], 'tree');
      const draggedSelector = getElementPath(dragged$[1], 'tree');
      // @ts-ignore
      cy.get(targetSelector).drag(draggedSelector, { force: true });
      targetNode.children.push(draggedNode.id);
      draggedNode.parent = targetNode;
      draggedNode.levelIndex = targetNode.levelIndex + 1;
      removeArrayElement(sourceLevel, n => n.id === draggedNode.id);
      removeArrayElement(
        draggedNodeParent.children,
        nid => nid === draggedNode.id,
      );
      targetLevel.push(draggedNode);
      const temp = targetLevel.slice();
      targetLevel.splice(0, Infinity);
      targetLevel.push(...temp.sort((a, b) => a.parent.id - b.parent.id));
    });
  });
};

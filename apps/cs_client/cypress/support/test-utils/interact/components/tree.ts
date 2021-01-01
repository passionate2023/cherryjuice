import { TreeAst } from '../../../../fixtures/tree/generate-tree';
import {
  randomArrayElement,
  removeArrayElement,
} from '../../../helpers/javascript-utils';
import { wait } from '../../../helpers/cypress-helpers';

type DndNodeProps = {
  tree: TreeAst;
};
const dndNode = ({ tree }: DndNodeProps) => {
  const sourceLevel = tree[tree.length - 1];
  const newParentLevel = tree[0];
  const targetLevel = tree[1];
  const draggedNode = randomArrayElement(sourceLevel);
  const draggedNodeParent = draggedNode.parent;
  const targetNode = randomArrayElement(newParentLevel);
  const targetSelector = `[data-node-id="${targetNode.id}"] div[data-droppable="true"]`;
  const draggedSelector = `[data-node-id="${draggedNode.id}"] span[draggable="true"]`;
  wait.s1;
  // @ts-ignore
  cy.get(draggedSelector).drag(targetSelector, { force: true });
  targetNode.children.push(draggedNode.id);
  draggedNode.parent = targetNode;
  draggedNode.levelIndex = targetNode.levelIndex + 1;
  removeArrayElement(sourceLevel, n => n.id === draggedNode.id);
  removeArrayElement(draggedNodeParent.children, nid => nid === draggedNode.id);
  targetLevel.push(draggedNode);
  const temp = targetLevel.slice();
  targetLevel.splice(0, Infinity);
  targetLevel.push(...temp.sort((a, b) => a.parent.id - b.parent.id));
};

const selectNode = ({ name }) => {
  cy.get('.tree')
    .findAllByText(name)
    .first()
    .click();
  wait.ms500();
};

export const tree = {
  select: { node: selectNode },
  dndNode,
};

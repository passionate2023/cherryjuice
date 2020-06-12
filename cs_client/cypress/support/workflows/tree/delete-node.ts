import { wait } from '../../helpers/cypress-helpers';
import { testIds } from '../../helpers/test-ids';
import { selectNode } from '../micro/select-node';
import { deleteNodeAndItsChildren } from '../../../fixtures/node/delete-node';

export const deleteNode = ({ tree }) => {
  const treeMap = new Map(tree.flatMap(x => x).map(node => [node.id, node]));
  const nodeToDelete = tree[0][0];
  selectNode(nodeToDelete);
  cy.findByTestId(testIds.toolBar__main__deleteNode).click();
  wait.ms500();
  cy.findByTestId(testIds.modal__deleteNode__confirm).click();

  deleteNodeAndItsChildren(tree)(treeMap)(nodeToDelete);
};

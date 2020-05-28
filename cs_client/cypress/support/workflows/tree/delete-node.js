import { wait } from '../../helpers/cypress-helpers';
import { testIds } from '../../helpers/test-ids';
import { deleteNodeAndItsChildren } from '../../../fixtures/nodes';

export const deleteNode = ({ tree }) => {
  const treeMap = new Map(tree.flatMap(x => x).map(node => [node.id, node]));
  const nodeToDelete = tree[0][0];
  cy.findAllByText(nodeToDelete.name)
    .last()
    .click();
  wait.ms500();
  cy.findByTestId(testIds.toolBar__main__deleteNode).click();
  wait.ms500();
  cy.findByTestId(testIds.modal__deleteNode__confirm).click();
  deleteNodeAndItsChildren(tree)(treeMap)(nodeToDelete);
};

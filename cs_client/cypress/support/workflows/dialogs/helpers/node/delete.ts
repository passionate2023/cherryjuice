import { wait } from '../../../../helpers/cypress-helpers';
import { testIds } from '../../../../helpers/test-ids';
import { deleteNodeAndItsChildren } from '../../../../../fixtures/node/delete-node';
import { tree } from '../../../tree/tree';

const deleteNode = ({ tree: treeAst }) => {
  const treeMap = new Map(treeAst.flatMap(x => x).map(node => [node.id, node]));
  const nodeToDelete = treeAst[0][0];
  tree.interactions.selectNode(nodeToDelete);
  cy.findByTestId(testIds.toolBar__main__deleteNode).click();
  wait.ms500();
  cy.findByTestId(testIds.modal__deleteNode__confirm).click();

  deleteNodeAndItsChildren(treeAst)(treeMap)(nodeToDelete);
};

export { deleteNode };

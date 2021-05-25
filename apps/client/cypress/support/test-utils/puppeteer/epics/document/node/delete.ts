import { wait } from '../../../../../helpers/cypress-helpers';
import { testIds } from '../../../../../helpers/test-ids';
import { deleteNodeAndItsChildren } from '../../../../../../fixtures/node/delete-node';
import { TreeAst } from '../../../../../../fixtures/tree/generate-tree';
import { interact } from '../../../../interact/interact';

const deleteNode = ({
  tree: treeAst,
  nodeCoordinates,
}: {
  tree: TreeAst;
  nodeCoordinates: [number, number];
}) => {
  const treeMap = new Map(treeAst.flatMap(x => x).map(node => [node.id, node]));
  const nodeToDelete = treeAst[nodeCoordinates[0]][nodeCoordinates[1]];
  interact.tree.select.node(nodeToDelete);
  cy.findByTestId(testIds.toolBar__main__deleteNode).click();
  wait.ms500();
  cy.findAllByTestId(testIds.modal__deleteNode__confirm)
    .first()
    .click({ force: true });
  deleteNodeAndItsChildren(treeAst)(treeMap)(nodeToDelete);
  wait.s1;
};

export { deleteNode };

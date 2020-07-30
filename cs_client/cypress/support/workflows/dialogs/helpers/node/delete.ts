import { wait } from '../../../../helpers/cypress-helpers';
import { testIds } from '../../../../helpers/test-ids';
import { deleteNodeAndItsChildren } from '../../../../../fixtures/node/delete-node';
import { tree } from '../../../tree/tree';
import { TreeAst } from '../../../../../fixtures/tree/generate-tree';

const deleteNode = ({
  tree: treeAst,
  nodeCoordinates,
}: {
  tree: TreeAst;
  nodeCoordinates: [number, number];
}) => {
  const treeMap = new Map(treeAst.flatMap(x => x).map(node => [node.id, node]));
  const nodeToDelete = treeAst[nodeCoordinates[0]][nodeCoordinates[1]];
  tree.interactions.selectNode(nodeToDelete);
  cy.findByTestId(testIds.toolBar__main__deleteNode).click();
  wait.ms500();
  cy.findByTestId(testIds.modal__deleteNode__confirm).click();

  deleteNodeAndItsChildren(treeAst)(treeMap)(nodeToDelete);
};

export { deleteNode };

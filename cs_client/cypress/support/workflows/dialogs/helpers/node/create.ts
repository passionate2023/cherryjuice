import { testIds } from '../../../../helpers/test-ids';
import { wait } from '../../../../helpers/cypress-helpers';
import { setNodeMeta } from './helpers';
import { tree } from '../../../tree/tree';
import { NodeAst } from '../../../../../fixtures/node/generate-node';

const createNode = ({ node }: { node: NodeAst }) => {
  const { name, isBold, parent, color, icon } = node;
  if (parent) {
    tree.interactions.selectNode(parent);
    cy.findByTestId(testIds.toolBar__main__createChildNode).click();
  } else {
    cy.findByTestId(testIds.toolBar__main__createSiblingNode).click();
  }
  wait.s1;
  setNodeMeta({ node: { name, isBold, color, icon } });
  wait.s1;
};

export { createNode };

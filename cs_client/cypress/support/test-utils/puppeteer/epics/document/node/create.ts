import { testIds } from '../../../../../helpers/test-ids';
import { wait } from '../../../../../helpers/cypress-helpers';
import { NodeAst } from '../../../../../../fixtures/node/generate-node';
import { interact } from '../../../../interact/interact';

export const setNodeMeta = ({ node }) => {
  ['isBold', 'color', 'name', 'icon', 'privacy'].forEach(key => {
    if (node[key]) {
      interact.nodeMeta.set[key](node[key]);
    }
  });
};

const createNode = ({ node }: { node: NodeAst }) => {
  const { name, isBold, parent, color, icon } = node;
  if (parent) {
    interact.tree.select.node(parent);
    cy.findByTestId(testIds.toolBar__main__createChildNode).click();
  } else {
    cy.findByTestId(testIds.toolBar__main__createSiblingNode).click();
  }
  wait.s1;
  setNodeMeta({ node: { name, isBold, color, icon } });
  interact.nodeMeta.apply();
};

export { createNode };

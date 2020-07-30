import { wait } from '../../../../helpers/cypress-helpers';
import { testIds } from '../../../../helpers/test-ids';
import { setNodeMeta } from './helpers';
import { tree } from '../../../tree/tree';

const edit = ({ editedNode, newAttributes }) => {
  tree.interactions.selectNode(editedNode);
  wait.s1;
  cy.findByTestId(testIds.toolBar__main__editNodeMeta).click();
  wait.ms500();
  setNodeMeta({ node: newAttributes });
  Object.entries(newAttributes).forEach(([key, value]) => {
    editedNode[key] = value;
  });
};

export { edit };

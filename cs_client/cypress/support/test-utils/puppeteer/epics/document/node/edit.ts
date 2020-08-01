import { wait } from '../../../../../helpers/cypress-helpers';
import { testIds } from '../../../../../helpers/test-ids';
import { setNodeMeta } from './create';
import { interact } from '../../../../interact/interact';

const edit = ({ editedNode, newAttributes }) => {
  interact.tree.select.node(editedNode);
  wait.s1;
  cy.findByTestId(testIds.toolBar__main__editNodeMeta).click();
  wait.ms500();
  setNodeMeta({ node: newAttributes });
  Object.entries(newAttributes).forEach(([key, value]) => {
    editedNode[key] = value;
  });
  interact.nodeMeta.apply();
};

export { edit };

import { testIds } from '../../helpers/test-ids';
import { wait } from '../../helpers/cypress-helpers';
import { setColorInputValue } from '../../helpers/dom';
import { selectNode } from '../micro/select-node';
// https://github.com/cypress-io/cypress/issues/1570#issuecomment-450966053
const setNodeMeta = ({ node }) => {
  const { isBold, color, name, icon } = node;
  cy.findByTestId(testIds.nodeMeta__nodeName)
    .clear()
    .type(name);
  if (isBold) {
    cy.findByTestId(testIds.nodeMeta__isBold).uncheck();
    cy.findByTestId(testIds.nodeMeta__isBold).click();
  }
  if (color) {
    cy.findByTestId(testIds.nodeMeta__hasCustomColor).uncheck();
    cy.findByTestId(testIds.nodeMeta__hasCustomColor).click();
    cy.findByTestId(testIds.nodeMeta__customColor).then($input => {
      const input = $input[0];
      setColorInputValue({ input, color });
    });
  }
  if (icon) {
    cy.findByTestId(testIds.nodeMeta__hasCustomIcon).uncheck();
    cy.findByTestId(testIds.nodeMeta__hasCustomIcon).click();
    cy.findByTestId(testIds.nodeMeta__customIcon).click();
    wait.ms250();
    cy.findByTestId(testIds.nodeMeta__customIconList).then($element => {
      const element = $element[0];
      element.children[icon - 1].click();
    });
  }
  cy.findByTestId(testIds.nodeMeta__apply).click();
};
export const createNode = ({ node }) => {
  const { name, isBold, parent, color, icon } = node;
  if (parent) {
    selectNode(parent);
    cy.findByTestId(testIds.toolBar__main__createChildNode).click();
  } else {
    cy.findByTestId(testIds.toolBar__main__createSiblingNode).click();
  }
  wait.s1();
  setNodeMeta({ node: { name, isBold, color, icon } });
};
export const editNode = ({ editedNode, newAttributes }) => {
  selectNode(editedNode);
  wait.s1();
  cy.findByTestId(testIds.toolBar__main__editNodeMeta).click();
  wait.ms500();
  setNodeMeta({ node: newAttributes });
  Object.entries(newAttributes).forEach(([key, value]) => {
    editedNode[key] = value;
  });
};

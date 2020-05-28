import { testIds } from '../helpers/test-ids';
import { wait } from '../helpers/cypress-helpers';
import { setColorInputValue } from '../helpers/dom';
// https://github.com/cypress-io/cypress/issues/1570#issuecomment-450966053

export const createNode = ({ name, isBold, parent, color, icon }) => {
  if (parent) {
    cy.findAllByText(parent.name)
      .last()
      .click();
    cy.findByTestId(testIds.toolBar__main__createChildNode).click();
  } else {
    cy.findByTestId(testIds.toolBar__main__createSiblingNode).click();
  }
  wait.s1();
  cy.findByTestId(testIds.nodeMeta__nodeName).type(name);
  if (isBold) cy.findByTestId(testIds.nodeMeta__isBold).click();
  if (color) {
    cy.findByTestId(testIds.nodeMeta__hasCustomColor).click();
    cy.findByTestId(testIds.nodeMeta__customColor).then($input => {
      const input = $input[0];
      setColorInputValue({ input, color });
    });
  }
  if (icon) {
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

import { testIds } from '../../../../helpers/test-ids';
import { setColorInputValue } from '../../../../helpers/dom';
import { wait } from '../../../../helpers/cypress-helpers';

const setNodeMeta = ({ node }) => {
  const { isBold, color, name, icon, privacy } = node;
  if (name) {
    cy.findByTestId(testIds.nodeMeta__nodeName)
      .clear()
      .type(name);
  }
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
      const child = element.children[icon - 1] as HTMLDivElement;
      child.click();
    });
  }

  if (privacy) {
    cy.findByTestId(testIds.nodeMeta__privacy).select(privacy);
  }
};

export { setNodeMeta };

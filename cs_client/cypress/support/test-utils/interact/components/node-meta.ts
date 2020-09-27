import { testIds } from '../../../helpers/test-ids';
import { wait } from '../../../helpers/cypress-helpers';
import { setColorInputValue } from '../../../helpers/dom';
import { Privacy } from '../../../../../types/graphql';

const set = {
  name: (name: string) => {
    cy.findByTestId(testIds.nodeMeta__nodeName)
      .clear()
      .type(name);
  },
  isBold: (isBold: boolean) => {
    if (isBold) {
      cy.findByTestId(testIds.nodeMeta__isBold).uncheck();
      cy.findByTestId(testIds.nodeMeta__isBold).click();
    }
  },
  color: (color: string) => {
    cy.findByTestId(testIds.nodeMeta__hasCustomColor).uncheck();
    cy.findByTestId(testIds.nodeMeta__hasCustomColor).click();
    cy.findByTestId(testIds.nodeMeta__customColor).then($input => {
      const input = $input[0];
      setColorInputValue({ input, color });
    });
  },
  icon: (icon: number) => {
    cy.findByTestId(testIds.nodeMeta__hasCustomIcon).uncheck();
    cy.findByTestId(testIds.nodeMeta__hasCustomIcon).click();
    cy.findByTestId(testIds.nodeMeta__customIcon).click();
    wait.ms250();
    cy.findByTestId(testIds.nodeMeta__customIconList).then($element => {
      const element = $element[0];
      const child = element.children[icon - 1] as HTMLDivElement;
      child.click();
    });
  },
  privacy: (privacy: Privacy) => {
    cy.findByTestId(testIds.nodeMeta__privacy).select(privacy);
  },
};

const apply = () => {
  cy.findByTestId(testIds.nodeMeta__apply).click();
  wait.s1;
  wait.ms500();
};
export const nodeMeta = {
  apply,
  set,
};

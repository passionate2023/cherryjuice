import { testIds } from '../../../helpers/test-ids';
import { wait } from '../../../helpers/cypress-helpers';
import { setColorInputValue } from '../../../helpers/dom';
import { Privacy } from '@cherryjuice/graphql-types';

const checkToggle = (testId: string) => {
  cy.findByTestId(testId).uncheck({ force: true });
  cy.findByTestId(testId).click({ force: true });
};

const set = {
  name: (name: string) => {
    cy.findByTestId(testIds.nodeMeta__nodeName)
      .clear()
      .type(name);
  },
  isBold: (isBold: boolean) => {
    if (isBold) {
      checkToggle(testIds.nodeMeta__isBold);
    }
  },
  color: (color: string) => {
    checkToggle(testIds.nodeMeta__hasCustomColor);
    cy.findByTestId(testIds.nodeMeta__customColor).then($input => {
      const input = $input[0];
      setColorInputValue({ input, color });
    });
  },
  icon: (icon: number) => {
    checkToggle(testIds.nodeMeta__hasCustomIcon);
    cy.findByTestId(testIds.nodeMeta__customIcon).click();
    wait.s1;
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
};
export const nodeMeta = {
  apply,
  set,
};

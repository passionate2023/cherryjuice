import { selectNode } from '../micro/select-node';
import { focusEditor } from '../micro/select-editor';
import { wait } from '../../helpers/cypress-helpers';

export const writeImage = ({ tree }) => {
  selectNode(tree[0][0]);
  cy.get('.tool-bar__icon--enabled > img').rightclick();
  focusEditor();
  cy.get('#rich-text').focus();
  wait.s1();
  cy.document().then(document => {
    document.execCommand('paste');
    cy.fixture('content/images/image1.png').then(image => {
      const img = `
            <img 
                src="${`data:image/png;base64,${image}`}"
                style="width: 100px;height:100px;" 
               class="rich-text__image" 
               data-id="${new Date().getTime().toString()}"
                /> 
                `;

      cy.get('.rich-text__line')
        .last()
        .then($div => {
          $div.append(img);
        });
    });
  });
};

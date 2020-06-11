import { selectNode } from '../../workflows/micro/select-node';
import { wait } from '../../helpers/cypress-helpers';

export const assertNodeImage = ({ node, images }) => {
  selectNode(node);
  wait.ms500();
  cy.get('#rich-text').then(editor$ => {
    const editor = editor$[0];
    const imagesInDom: HTMLImageElement[] = Array.from(
      editor.querySelectorAll('img.rich-text__image'),
    );
    expect(imagesInDom.length).equal(images.length);
    imagesInDom.forEach((imageInDom, i) => {
      expect(imageInDom.src).equal(node.images[i].src);
    });
  });
};

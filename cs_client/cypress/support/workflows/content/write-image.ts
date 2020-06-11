import { selectNode } from '../micro/select-node';
import { wait } from '../../helpers/cypress-helpers';
import { ImageAst, imgAstToImage } from '../../../fixtures/content/image';

type WriteImage = {
  node: any;
  images: ImageAst[];
};


const writeImage = ({ node, images }: WriteImage) => {
  selectNode(node);

  wait.s1();
  cy.get('.rich-text__line')
    .last()
    .then($div => {
      $div.append(...images.map(imgAstToImage));
    });
};

export { writeImage };

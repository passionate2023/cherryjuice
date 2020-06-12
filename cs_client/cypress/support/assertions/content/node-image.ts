// @ts-ignore
import { anyImageBase64ToPngBase64 } from '../../../../src/helpers/editing/clipboard';
import { selectNode } from '../../workflows/micro/select-node';
import { wait } from '../../helpers/cypress-helpers';
import { NodeAst } from '../../../fixtures/node/generate-node';
import { ImageAst } from '../../../fixtures/node/generate-node-content/image/generate-image';

type AssertNodeImage = {
  node: NodeAst;
  images: ImageAst[];
};
export const assertNodeImage = ({ node, images }: AssertNodeImage) => {
  selectNode(node);
  wait.ms500();
  cy.get('#rich-text').then(editor$ => {
    const editor = editor$[0];
    const imagesInDom: HTMLImageElement[] = Array.from(
      editor.querySelectorAll('img.rich-text__image'),
    );
    expect(imagesInDom.length).equal(images.length);

    imagesInDom.forEach(async (imageInDom, i) => {
      const imageEl = document.createElement('img');
      const {
        attributes: { src },
        meta: { h, w },
      } = node.images[i];
      imageEl.src = src;
      imageEl.style.width = `${w}px`;
      imageEl.style.height = `${h}px`;
      await new Promise(res => {
        imageEl.onload = res;
      });
      const pngBase64 = anyImageBase64ToPngBase64(imageEl, document);
      expect(imageInDom.src).equal(pngBase64);
    });
  });
};

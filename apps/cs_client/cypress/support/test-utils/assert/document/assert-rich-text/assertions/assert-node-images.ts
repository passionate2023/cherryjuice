import { wait } from '../../../../../helpers/cypress-helpers';
import { NodeAst } from '../../../../../../fixtures/node/generate-node';
import { ImageAst } from '../../../../../../fixtures/node/generate-node-content/image/generate-image';

const anyImageBase64ToPngBase64 = (image: HTMLImageElement): string => {
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, image.width, image.height);
  return canvas.toDataURL('image/png');
};

type AssertNodeImage = {
  node: NodeAst;
  images: ImageAst[];
};
export const assertNodeImage = ({ node, images }: AssertNodeImage) => {
  cy.log('assert-node-images');
  cy.get('#rich-text').then(editor$ => {
    const editor = editor$[0];
    const imagesInDom: HTMLImageElement[] = Array.from(
      editor.querySelectorAll('img.rich-text__image'),
    );
    expect(imagesInDom.length).equal(images.length);
    imagesInDom.forEach((imageInDom, i) => {
      const imageEl = document.createElement('img');
      const {
        attributes: { src },
        meta: { h, w },
      } = node.images[i];
      const isBlob = i === images.length - 1;
      new Cypress.Promise(res => {
        node.images[i].getBlob(res);
      }).then(blob => {
        imageEl.src = isBlob ? blob : src;
        imageEl.style.width = `${w}px`;
        imageEl.style.height = `${h}px`;
        new Cypress.Promise(res => {
          imageEl.onload = res;
        }).then(() => {
          const pngBase64 = anyImageBase64ToPngBase64(imageEl);
          expect(imageInDom.src).equal(pngBase64);
        });
      });
    });
  });
  wait.s1;
};

import { pasteIntoEditor } from '../micro/paste-into-editor';
import { imgAstToImageHTMLString } from '../../../fixtures/node/generate-node-content/image/helpers';
import { ImageAst } from '../../../fixtures/node/generate-node-content/image/generate-image';
import { wait } from '../../helpers/cypress-helpers';

type WriteImage = {
  node: any;
  images: ImageAst[];
};

const writeHtmlImages = ({ images, node }: WriteImage) => {
  const htmlImages = images
    .map(imgAstToImageHTMLString)
    .map(img => `${img}`)
    .join('');
  pasteIntoEditor({
    node,
    pastedData: {
      type: 'text/html',
      value: ['div'].reduce(
        (acc, val) => `<${val}>${acc}</${val}>`,
        htmlImages,
      ),
    },
    cursor: {
      lineIndex: 0,
      position: 'start',
    },
  });
};

const writeBlobImages = ({ images, node }: WriteImage) => {
  for (const image of images) {
    pasteIntoEditor({
      node,
      image,
      cursor: {
        lineIndex: 0,
        position: 'start',
      },
    });
    wait.ms250();
  }
};

export { writeBlobImages, writeHtmlImages };

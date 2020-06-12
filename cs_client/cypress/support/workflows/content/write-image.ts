import { pasteIntoEditor } from '../micro/paste-into-editor';
import { imgAstToImage } from '../../../fixtures/node/generate-node-content/image/helpers';
import { ImageAst } from '../../../fixtures/node/generate-node-content/image/generate-image';

type WriteImage = {
  node: any;
  images: ImageAst[];
};

const writeImage = ({ node, images }: WriteImage) => {
  const image = images
    .map(imgAstToImage)
    .map(img => `${img}`)
    .join('');
  pasteIntoEditor({
    node,
    pastedData: {
      type: 'text/html',
      value: ['span'].reduce((acc, val) => `<${val}>${acc}</${val}>`, image),
    },
    cursor: {
      lineIndex: 0,
      position: 'start',
    },
  });
};

export { writeImage };

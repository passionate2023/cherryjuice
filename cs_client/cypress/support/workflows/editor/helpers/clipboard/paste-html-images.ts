import { imgAstToImageHTMLString } from '../../../../../fixtures/node/generate-node-content/image/helpers';
import { editor } from '../../editor';
import { ImageAst } from '../../../../../fixtures/node/generate-node-content/image/generate-image';
type WriteImage = {
  node: any;
  images: ImageAst[];
};
const pasteHtmlImages = ({ images, node }: WriteImage) => {
  const htmlImages = images
    .map(imgAstToImageHTMLString)
    .map(img => `${img}`)
    .join('');
  editor.clipboard.paste({
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

export { pasteHtmlImages };
export { WriteImage };

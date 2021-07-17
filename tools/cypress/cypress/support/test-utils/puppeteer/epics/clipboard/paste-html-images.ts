import { imgAstToImageHTMLString } from '../../../../../fixtures/node/generate-node-content/image/helpers';
import { ImageAst } from '../../../../../fixtures/node/generate-node-content/image/generate-image';
import { puppeteer } from '../../puppeteer';
type WriteImage = {
  node: any;
  images: ImageAst[];
};
const pasteHtmlImages = ({ images, node }: WriteImage) => {
  const htmlImages = images
    .map(imgAstToImageHTMLString)
    .map(img => `${img}`)
    .join('');
  puppeteer.content.clipboard.paste({
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

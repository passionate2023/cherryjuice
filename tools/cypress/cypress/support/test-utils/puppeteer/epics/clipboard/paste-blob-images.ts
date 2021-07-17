import { wait } from '../../../../helpers/cypress-helpers';
import { WriteImage } from './paste-html-images';
import { puppeteer } from '../../puppeteer';

const pasteBlobImages = ({ images, node }: WriteImage) => {
  for (const image of images) {
    puppeteer.content.clipboard.paste({
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

export { pasteBlobImages };

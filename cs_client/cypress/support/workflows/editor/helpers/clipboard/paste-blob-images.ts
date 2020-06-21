import { editor } from '../../editor';
import { wait } from '../../../../helpers/cypress-helpers';
import { WriteImage } from './paste-html-images';

const pasteBlobImages = ({ images, node }: WriteImage) => {
  for (const image of images) {
    editor.clipboard.paste({
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

/* eslint-disable @typescript-eslint/no-use-before-define */
import { paste } from './helpers/clipboard/helpers/paste';
import { selectLine } from './helpers/interaction/select-line';
import { focus } from './helpers/interaction/focus';
import { pasteHtmlImages } from './helpers/clipboard/paste-html-images';
import { pasteBlobImages } from './helpers/clipboard/paste-blob-images';
import { typeText } from './helpers/keybord/type-text';

const editor = {
  clipboard: {
    paste,
    pasteHtmlImages,
    pasteBlobImages,
  },
  keyboard: {
    typeText,
  },
  interactions: {
    focus,
    selectLine,
  },
};
type Editor = typeof editor;

export { editor };
export { Editor };

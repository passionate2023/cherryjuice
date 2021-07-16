import { getTestCallbacks } from '../../../../../helpers/test-callbacks';
import { wait } from '../../../../../helpers/cypress-helpers';
import { ImageAst } from '../../../../../../fixtures/node/generate-node-content/image/generate-image';
import { eventCreator, EventCreatorProps } from './helpers';
import { interact } from '../../../../interact/interact';
import { Cursor } from '../../../../interact/components/editor';

type PasteProps = {
  image?: ImageAst;
  pastedData?: EventCreatorProps;
  node: any;
  cursor: Cursor;
};

const paste = ({ pastedData, node, cursor, image }: PasteProps): void => {
  interact.tree.select.node(node);
  interact.editor.focus();
  interact.editor.selectLine(cursor);
  getTestCallbacks().then(tc => {
    if (image) {
      new Cypress.Promise(res => {
        image.getBlob(res);
      }).then((blob: Blob) => {
        const event = eventCreator({ type: 'Files', value: blob });
        tc.clipboard.onpaste(event);
      });
    } else {
      const event = eventCreator(pastedData);
      tc.clipboard.onpaste(event);
    }
  });
  wait.ms250();
};
export { paste };

import { pipe1 } from '::helpers/editing/execK/steps/pipe1';
import { CustomRange } from '::helpers/editing/execK/steps/get-selection';
import { writeChangesToDom } from '::helpers/editing/execK/steps/pipe3';
import { setTextSelection } from '::helpers/editing/execK/steps/restore-selection';
import { getEditor } from '::root/components/app/components/editor/document/components/rich-text/hooks/get-node-images';
import { newObjectPrefix } from '::root/components/app/components/editor/document/components/rich-text/hooks/add-meta-to-pasted-images';
import { Anchor } from '@cs/ahtml-to-html/objects/anchor/anchor';
import { Code } from '@cs/ahtml-to-html/objects/code';
import { CodeboxProperties } from '::root/components/app/components/menus/dialogs/codebox/reducer/reducer';

export const createAnchorHtml = (id: string): string =>
  Anchor({ other_attributes: { id } });

export const createCodeboxHtml = ({
  widthType,
  width,
  height,
  autoExpandHeight,
}: CodeboxProperties) =>
  Code({
    _: '',
    style: { height: height + 'px' },
    other_attributes: {
      do_highl_bra: 0,
      do_show_linenum: 0,
      is_width_pix: widthType === 'pixels' ? 1 : 0,
      syntax: 'text',
      width_raw: width,
      fixedHeight: autoExpandHeight === 'fixed',
    },
  });

const addTimestampToMarkup = (
  html: string,
  timestamp: string,
  className: string,
  key = 'data-ts',
): string =>
  html.replace(
    `class="${className}"`,
    `${`class="${className}"`} ${key}="${timestamp}" `,
  );

type RichTextObject = {
  type: 'png' | 'code';
  outerHTML: string;
};

const classNames = {
  code: 'rich-text__code',
  png: 'rich-text__anchor',
};

export const insertObject = (
  selection: CustomRange,
  object: RichTextObject,
) => {
  const timestamp = `${newObjectPrefix}${Date.now()}`;
  const editor = getEditor();
  const { startElement, endElement, startOffset, endOffset } = selection;
  const splitSelection = pipe1({
    selectionStartElement: startElement,
    selectionEndElement: endElement,
    startOffset,
    endOffset,
    stampPrefix: 'p',
  });
  object.outerHTML = addTimestampToMarkup(
    object.outerHTML,
    timestamp,
    classNames[object.type],
  );
  writeChangesToDom(
    {
      childrenOfStartDDDE: [splitSelection.left, object, splitSelection.right],
      midDDOEs: [],
      childrenOfEndDDDE: [],
    },
    {
      startAnchor: splitSelection.startAnchor,
      endAnchor: splitSelection.endAnchor,
    },
    { filterEmptyNodes: false },
  );
  editor.focus();
  const anchor = document.querySelector(`[data-ts="${timestamp}"]`);
  setTextSelection(
    {
      startElement: anchor.nextElementSibling || anchor,
      endElement: anchor.nextElementSibling || anchor,
      startOffset: 0,
      endOffset: 0,
    },
    true,
  );
  anchor.removeAttribute('data-ts');
};

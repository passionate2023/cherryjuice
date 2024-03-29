import { pipe1 } from '::helpers/execK/steps/pipe1';
import { CustomRange } from '::helpers/execK/steps/get-selection';
import { writeChangesToDom } from '::helpers/execK/steps/pipe3';
import { setTextSelection } from '::helpers/execK/steps/restore-selection';
import { getEditor } from '::helpers/pages-manager/helpers/get-editor';
import { newObjectPrefix } from '::helpers/clipboard/helpers/steps/add-to-dom/helpers/add-meta-to-pasted-images';
import { Anchor, Code, Table } from '@cherryjuice/ahtml-to-html';
export type TableProperties = {
  rows: number;
  columns: number;
};
export type CodeboxProperties = {
  width: number;
  widthType: 'pixels' | '%';
  height: number;
  autoExpandHeight: 'fixed' | 'auto';
};
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
export const createTableHtml = ({ rows, columns }: TableProperties) => {
  const th = Array.from({ length: columns }).map(() => '');
  return Table({
    table: {
      th: th,
      td: Array.from({ length: rows }).map(() => th),
    },
    other_attributes: { col_min_width: 100, col_max_width: 100 },
  });
};

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
  type: 'png' | 'code' | 'table';
  outerHTML: string;
};

const classNames = {
  code: 'rich-text__code',
  png: 'rich-text__anchor',
  table: 'rich-text__table',
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
    stampPrefix: 'o',
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
  const insertedObject = document.querySelector(`[data-ts="${timestamp}"]`);
  setTextSelection(
    {
      startElement: insertedObject.nextElementSibling || insertedObject,
      endElement: insertedObject.nextElementSibling || insertedObject,
      startOffset: 0,
      endOffset: 0,
    },
    true,
  );
  insertedObject.removeAttribute('data-ts');
};

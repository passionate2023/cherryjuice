import { Png } from './png';
import { Code } from './code';
import { Table } from './table';
import { Element, stringifyStyles } from './element';
import { escapeHtml } from '../../../helpers/escape-html';

const aHtmlToHtml = ({ richText }) => {
  let res: string = '<article></article>';
  try {
    res = `${richText
      .map(
        line =>
          `<span class="rich-text__line" style="${
            line.styles ? `${stringifyStyles(line.styles)}` : ''
          }">${line.nodes
            .map(node =>
              typeof node === 'string'
                ? escapeHtml(node)
                : node._
                ? ((node._ = escapeHtml(node._)), node)
                : node,
            )
            .map(node =>
              typeof node === 'object'
                ? node.type
                  ? node.type === 'tab'
                    ? Array.from({ length: node.length })
                        .map((_, i) => (i % 2 === 0 ? '&nbsp;' : ' '))
                        .join('')
                    : node.type === 'anchor'
                    ? `<img
                        id="${node.other_attributes.id}"
                        class="rich-text__anchor"
                        src="/icons/anchor.svg"
                        alt="icon"
                      />`
                    : node.type === 'png'
                    ? Png({
                        styles: node.$,
                        other_attributes: node.other_attributes,
                      })
                    : node.type === 'code'
                    ? Code({
                        styles: node.$,
                        other_attributes: node.other_attributes,
                        text: node._,
                      })
                    : node.type === 'table'
                    ? Table({
                        table: node.table,
                        styles: node.$,
                        other_attributes: node.other_attributes,
                      })
                    : ''
                  : Element({ node })
                : `<span>${node}</span>`,
            )
            .join('')}${
            '</span>'
            // line.styles ? '</div>' : i < lines.length - 1 ? '<br />' : ''
          }`,
      )
      .join('')}`;
  } catch (e) {
    console.error(e);
  }
  return res;
};

export { aHtmlToHtml };

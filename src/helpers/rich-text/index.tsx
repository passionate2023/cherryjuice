import { Png } from './png';
import { Code } from './code';
import { Table } from './table';
import { Element } from './element';
import { escapeHtml } from '../ctb-interpreter/helpers/escape-html';

const RichText = ({ richText, node_id, file_id }) => {
  const res = `<article>${richText
    .map(
      inlineNodes =>
        `${inlineNodes
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
                      node_id: node_id,
                      offset: node.other_attributes.offset,
                      height: node.$.height,
                      width: node.$.width,
                      file_id: file_id,
                    })
                  : node.type === 'code'
                  ? Code({
                      styles: node.$,
                      other_attributes: node.other_attributes,
                      text: node._,
                    })
                  : node.type === 'table'
                  ? Table({ table: node.table })
                  : ''
                : Element({ node })
              : node,
          )
          .join('')}<br />`,
    )
    .join('')}
    </article>`;
  console.log({ res });
  return res;
};

export { RichText };

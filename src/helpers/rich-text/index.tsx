import { Link as CtLink } from './link';
import { Png } from './png';
import { Code } from './code';
import { Table } from './table';
type Props = {
  has_txt: boolean;
  file_id: string;
};

const createElement = (tag, style, children) =>
  `<${tag} style="${Object.entries(style)
    .map(([key, value]) => `${key}:${value}`)
    .join(';')}">${children}</${tag}>`;

const RichText = ({ richText, node_id, file_id }) => {
  return `
    <article class="rtModule.richText">
      ${richText
        .map(
          inlineNodes =>
            `${inlineNodes
              .map((node, i) =>
                typeof node === 'object'
                  ? node.type
                    ? node.type === 'tab'
                      ? Array.from({ length: node.length })
                          .map((_, i) => (i % 2 === 0 ? '&nbsp;' : ' '))
                          .join('')
                      : node.type === 'anchor'
                      ? `<img
                        id={node.other_attributes.id}
                        class="rtModule.richText__anchor"
                        src="anchorIcon"
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
                    : node.tags.reduce(
                        // @ts-ignore
                        (acc, val) => {
                          if (typeof val !== 'string') console.log('val', val);
                          return typeof val === 'string'
                            ? createElement(
                                `${val}`,
                                { ...node.$, display: 'inline' },
                                acc,
                              )
                            : CtLink({
                                target: val[1].target,
                                href: val[1].href,
                                text: node._,
                              });
                        },
                        node._,
                      )
                  : node,
              )
              .join('')}
            <br />
           `,
        )
        .join('')}
    </article>
  `;
};

export { RichText };

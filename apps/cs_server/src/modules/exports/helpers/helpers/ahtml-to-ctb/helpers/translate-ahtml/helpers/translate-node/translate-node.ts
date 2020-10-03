import { translateColor } from './helpers/translate-color';
import { translateLink } from './helpers/translate-link';
import {AHtmlNode} from "@cherryjuice/ahtml-to-html";

const createTranslator = (styles: { [key: string]: string | number }) => {
  return {
    styles: {
      color: c => (styles['foreground'] = translateColor(c)),
      ['background-color']: c => (styles['background'] = translateColor(c)),
      ['text-decoration']: c => {
        c.split(' ').forEach(c => {
          if (c === 'underline') {
            styles['underline'] = 'single';
          } else if (c === 'line-through') {
            styles['strikethrough'] = 'true';
          }
        });
      },
      width: c => (styles['width'] = +c.match(/\d+/)[0]),
      height: c => (styles['height'] = +c.match(/\d+/)[0]),
    },
    tags: {
      strong: () => (styles['weight'] = 'heavy'),
      em: () => (styles['style'] = 'italic'),
      code: () => (styles['family'] = 'monospace'),
      ...[
        ...Array.from({ length: 6 }).map((_, i) => `h${i + 1}`),
        ...['small', 'sub', 'sup'],
      ].reduce(
        (acc, tag) => ((acc[tag] = () => (styles['scale'] = tag)), acc),
        {},
      ),
      a: attributes => {
        styles['link'] = translateLink(attributes);
      },
    },
  };
};
const ignoredArtificialStyles = {
  'max-width': true,
  'min-height': true,
  display: true,
};
type CTJustification = 'left' | 'end' | 'center' | 'justify';
const tagsToIgnore = new Set<string>(['span']);
type LineStyle = { 'text-align'?: CTJustification };
const translateNode = ({
  node,
  justification,
}: {
  node: AHtmlNode;
  justification: CTJustification;
}) => {
  const attributes = {};
  const translator = createTranslator(attributes);

  if (justification !== 'left') {
    attributes['justification'] = justification;
  }
  node.tags.forEach(([tagName, attributes]) => {
    if (attributes?.style)
      Object.entries(attributes.style).forEach(([key, value]) => {
        try {
          translator.styles[key](value);
        } catch (e) {
          if (!ignoredArtificialStyles[key]) {
            const message = `could not translate attribute [${key}]:[${value}]
               node: [${JSON.stringify(node)}]`;
            // eslint-disable-next-line no-console
            console.log(message);
            throw e;
          }
        }
      });
    try {
      translator.tags[tagName](attributes);
    } catch (e) {
      if (!tagsToIgnore.has(tagName)) {
        const message = `could not translate tag [${tagName}]:[${attributes}]
         node: [${JSON.stringify(node)}]`;
        // eslint-disable-next-line no-console
        console.info(message);
        throw e;
      }
    }
  });
  const newNode = { ...node, $: attributes };
  delete newNode.tags;
  return newNode;
};

export { translateNode };
export { LineStyle, CTJustification };

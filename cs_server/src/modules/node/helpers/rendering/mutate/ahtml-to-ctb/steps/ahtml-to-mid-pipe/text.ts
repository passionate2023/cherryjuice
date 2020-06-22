import { cssPreferences } from '../../../../query/ctb-to-ahtml/steps/translate-attributes-to-html-and-css';

const utils = {
  rgbToRrrrggggbbbbb: c =>
    c
      .match(/\d{1,3}/g)
      .map(d => Number(d).toString(16))
      .map(d => (Number(d) < 10 && !isNaN(d) ? '0' + d : d))
      .reduce((acc, val) => `${acc}${val}`, '#'), // todo: implement me
};
const createTranslator = (styles: { [key: string]: string | number }) => {
  return {
    styles: {
      color: c => (styles['foreground'] = utils.rgbToRrrrggggbbbbb(c)),
      ['background-color']: c =>
        (styles['background'] = utils.rgbToRrrrggggbbbbb(c)),
      ['text-decoration']: c =>
        c === 'underline'
          ? (styles['underline'] = 'single')
          : c === 'line-through'
          ? (styles['strikethrough'] = 'true')
          : undefined,
      width: c => (styles['width'] = +c.match(/\d+/)[0]),
      height: c => (styles['height'] = +c.match(/\d+/)[0]),
    },
    tags: {
      strong: () => (styles['weight'] = 'heavy'),
      // b: () => (styles['weight'] = 'heavy'),
      // br: () => undefined,
      em: () => (styles['style'] = 'italic'),
      code: () => (styles['family'] = 'monospace'),
      ...[
        ...Array.from({ length: 6 }).map((_, i) => `h${i + 1}`),
        ...['small', 'sub', 'sup'],
      ].reduce(
        (acc, tag) => ((acc[tag] = () => (styles['scale'] = tag)), acc),
        {},
      ),
    },
    otherTables: {
      img: () => undefined,
      table: () => undefined,
      code: () => undefined,
    },
  };
};
const ignoredArtificialStyles = {
  'max-width': true,
  'min-height': true,
  display: true,
};
const tagsToIgnore = new Set<string>(['span']);
const translateText = ({ node }) => {
  const styles = {};
  Object.entries(cssPreferences).forEach(([tagName, customStyles]) => {
    if (node.tags.includes(tagName)) {
      Object.keys(customStyles).forEach(style => delete node.$[style]);
    }
  });
  const translator = createTranslator(styles);

  node.tags.forEach(([tagName, attributes]) => {
    try {
      if (attributes?.style)
        Object.entries(attributes.style).forEach(([key, value]) => {
          try {
            translator.styles[key](value);
          } catch {
            if (!ignoredArtificialStyles[key])
              throw new Error(
                `Exception in the interpreter: translator.styles[${key}] is not defined
             value: ${value} 
             node: ${JSON.stringify(node)}
            `,
              );
          }
        });
      if (!tagsToIgnore.has(tagName)) translator.tags[tagName](node);
    } catch {
      throw new Error(
        `Exception in the interpreter: translator.tags[${tagName}] is not defined`,
      );
    }
  });
  const newNode = { ...node, $: styles };
  delete newNode.tags;
  return newNode;
};

export { translateText };

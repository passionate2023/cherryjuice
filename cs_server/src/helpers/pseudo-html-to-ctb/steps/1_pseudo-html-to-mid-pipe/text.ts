import { cssPreferences } from '../../../ctb-interpreter/steps/translate-attributes-to-html-and-css';
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
      em: () => (styles['style'] = 'italic'),
      code: () => (styles['family'] = 'monospace'),
      small: () => (styles['scale'] = 'small'),
      sub: () => (styles['scale'] = 'sub'),
      sup: () => (styles['scale'] = 'sup'),
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

const translateText = ({ node }) => {
  const styles = {};
  Object.entries(cssPreferences).forEach(([tagName, customStyles]) => {
    if (node.tags.includes(tagName)) {
      Object.keys(customStyles).forEach(style => delete node.$[style]);
    }
  });
  const translator = createTranslator(styles);

  Object.entries(node.$).forEach(([key, value]) => {
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
  node.tags.forEach(tag => {
    try {
      translator.tags[tag](node);
    } catch {
      if (!translator.otherTables[tag])
        throw new Error(
          `Exception in the interpreter: translator.tags[${tag}] is not defined`,
        );
    }
  });
  const newNode = { ...node, $: styles };
  delete newNode.tags;
  return newNode;
};

export { translateText };

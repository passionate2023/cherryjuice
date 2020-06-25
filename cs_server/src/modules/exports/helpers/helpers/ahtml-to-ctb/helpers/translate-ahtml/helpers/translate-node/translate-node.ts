import path from 'path';

const utils = {
  rgbToHex: color =>
    '#' +
    Array.from(color.matchAll(/\d+/g))
      .map(arr => +arr[0])
      .map(d => `${d.toString(16)}`.padStart(2, '0'))
      .join(''),
  isHex: color => color.startsWith('#'),
  adaptColor: color => (utils.isHex(color) ? color : utils.rgbToHex(color)),
  translateLink: {
    node: href => {
      if (/(\d+)#(.+)$/.test(href)) {
        const [, id, value] = href.match(/(\d+)#(.+)$/);
        return `node ${id} ${value}`;
      } else if (/\d+/.test(href)) {
        const [, id] = href.match(/(\d+)$/);
        return `node ${id}`;
      }
    },
    web: href => {
      return `webs ${href}`;
    },
    folder: href => {
      const [, value] = href.match(/file:\/\/\/(.+$)/);
      const encryptedValue = new Buffer(path.resolve(value)).toString('base64');
      return `fold ${encryptedValue}`;
    },
    file: href => {
      const [, value] = href.match(/file:\/\/\/(.+$)/);
      const encryptedValue = new Buffer(path.resolve(value)).toString('base64');
      return `file ${encryptedValue}`;
    },
  },
};

const createTranslator = (styles: { [key: string]: string | number }) => {
  return {
    styles: {
      color: c => (styles['foreground'] = utils.adaptColor(c)),
      ['background-color']: c => (styles['background'] = utils.adaptColor(c)),
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
      a: attributes => {
        const type = attributes['data-type'];
        const href = attributes.href;
        styles['link'] = utils.translateLink[type](href);
      },
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
const translateNode = ({ node }) => {
  const attributes = {};
  const translator = createTranslator(attributes);

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

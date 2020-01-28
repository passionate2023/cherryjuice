const path = require('path');
const preferences = { code: { 'background-color': '#2B2B2B' } };

const utils = {
  rrrrggggbbbbbToRrggbb: c => c[0] + c[1] + c[2] + c[5] + c[6] + c[9] + c[10],
  parseLink: c => {
    let attributes = { href: '', target: '_blank',type:'' };
    if (c.startsWith('node')) {
      const [, id, anchor] = /node (\d+) (.+)/.exec(c);
      attributes.href = `node-${id}#${encodeURIComponent(anchor)}`;
      attributes.type = 'node';
    } else if (c.startsWith('webs')) {
      const [, url] = /webs (.+)/.exec(c);
      attributes.href = url;
      attributes.type = 'web';
    } else if (c.startsWith('file')) {
      const [, url] = /file (.+)/.exec(c);
      attributes.href = `file:///${path.resolve(
        Buffer.from(url, 'base64').toString(),
      )}`;
      attributes.type = 'file';
    } else {
      const [, url] = /fold (.+)/.exec(c);
      attributes.href = `file:///${path.resolve(
        Buffer.from(url, 'base64').toString(),
      )}`;
      attributes.type='folder';
    }

    return attributes;
  },
};
const createTranslator = (
  tags: (string | { href: any })[],
  styles: { [key: string]: string },
) => {
  return {
    foreground: c =>
      (styles['color'] = c.length === 7 ? c : utils.rrrrggggbbbbbToRrggbb(c)),
    background: c =>
      (styles['background-color'] = utils.rrrrggggbbbbbToRrggbb(c)),
    underline: () => (styles['text-decoration'] = 'underline'),
    strikethrough: () => (styles['text-decoration'] = 'line-through'),
    weight: () => tags.push('strong'),
    style: () => tags.push('em'),
    scale: c => tags.push(c), // todo: complete this
    family: () => tags.push('code'),
    justification: c => (styles['textAlign'] = c),
    width: c => (styles['width'] = `${c}px`),
    height: c => (styles['height'] = `${c}px`),
    // @ts-ignore
    link: c => tags.push(['a', utils.parseLink(c)]),
    // @ts-ignore
  };
};
const whiteListedAttributes = {
  containsNewLine: true,
};
const translateAttributesToHtmlAndCss = xml =>
  xml.map(node => {
    if (node.$) {
      const tags = [];
      const styles = {};
      const translator = createTranslator(tags, styles);
      Object.entries(node.$).forEach(([key, value]) => {
        try {
          translator[key](value);
        } catch {
          if (!whiteListedAttributes[key])
            throw new Error(
              `Exception in the interpreter: translator[${key}] is not defined`,
            );
        }
      });
      // add default/preferred styles, such as monospace background
      Object.entries(preferences).forEach(([tag, customStyles]) => {
        if (tags.includes(tag)) {
          Object.entries(customStyles).forEach(([customStyle, value]) => {
            if (!styles[customStyle]) {
              styles[customStyle] = value;
            }
          });
        }
      });
      node.$ = styles;
      node.tags = tags;
    }
    return node;
  });
export { translateAttributesToHtmlAndCss };

const utils = {
  rrrrggggbbbbbToRrggbb: c => c[0] + c[1] + c[2] + c[5] + c[6] + c[9] + c[10],
  parseLink: c => {
    let attributes = { href: '', target: '' };
    if (c.startsWith('node')) {
      const [, id, anchor] = /node (\d+) (.+)/.exec(c);
      attributes.href = `node-${id}#${encodeURIComponent(anchor)}`;
      attributes.target = 'node';
    } else if (c.startsWith('webs')) {
      const [, url] = /webs (.+)/.exec(c);
      attributes.href = url;
      attributes.target = '_blank';
    } else if (c.startsWith('file')) {
      const [, url] = /file (.+)/.exec(c);
      attributes.href = url;
      attributes.target = 'file';
    } else {
      const [, url] = /fold (.+)/.exec(c);
      attributes.href = url;
      attributes.target = 'folder';
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
    justification: c => (styles['text-align'] = c),
    width: c => (styles['width'] = `${c}px`),
    height: c => (styles['height'] = `${c}px`),
    // @ts-ignore
    link: c => tags.push(['a', utils.parseLink(c)]),
    // @ts-ignore
  };
};

const translateAttributesToHtmlAndCss = ogObject => {
  const tags = [];
  const styles = {};
  const translator = createTranslator(tags, styles);
  Object.entries(ogObject).forEach(([key, value]) => {
    try {
      translator[key](value);
    } catch {
      throw new Error(
        `Exception in the interpreter: translator[${key}] is not defined`,
      );
    }
  });
  // @ts-ignore
  styles.tags = tags;
  return styles;
};

export { translateAttributesToHtmlAndCss };

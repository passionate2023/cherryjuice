const utils = {
  rrrrggggbbbbbToRrggbb: c => c[0] + c[1] + c[2] + c[5] + c[6] + c[9] + c[10]
};
const createTranslator = (
  tags: (string | { href: any })[],
  styles: { [key: string]: string }
) => {
  return {
    foreground: c => (styles['color'] = utils.rrrrggggbbbbbToRrggbb(c)),
    background: c =>
      (styles['background-color'] = utils.rrrrggggbbbbbToRrggbb(c)),
    underline: () => (styles['text-decoration'] = 'underline'),
    strikethrough: () => (styles['text-decoration'] = 'line-through'),
    weight: () => tags.push('strong'),
    style: () => tags.push('em'),
    scale: c => tags.push(c), // todo: complete this
    family: () => tags.push('code'),
    justification: c => (styles['text-align'] = c),
    // @ts-ignore
    link: c => tags.push(['a', [{ href: c }]])
  };
};
const interpreter = ogObject => {
  const tags = [];
  const styles = {};
  const translator = createTranslator(tags, styles);
  Object.entries(ogObject).forEach(([key, value]) => {
    try {
      translator[key](value);
    } catch {
      throw new Error(
        `Exception in the interpreter: translator[${key}] is not defined`
      );
    }
  });
  // @ts-ignore
  styles.tags = tags;
  return styles;
};

export { interpreter };

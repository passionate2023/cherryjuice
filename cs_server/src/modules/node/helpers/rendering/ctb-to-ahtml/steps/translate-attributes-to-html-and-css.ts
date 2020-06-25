import { parseLink } from '../../ahtml-to-html/helpers/ctb';
const preferences = { code: { 'background-color': '#2B2B2B' } };

const utils = {
  rrrrggggbbbbbToRrggbb: c => c[0] + c[1] + c[2] + c[5] + c[6] + c[9] + c[10],
  parseLink,
};
const justificationMap = {
  'text-align': {
    right: 'end',
    center: 'center',
    fill: 'justify',
  },
};
const createTranslatedNode = (lineStyles: { [key: string]: string }) => {
  const tags: [string, Record<string, any>][] = [];
  const styles: { [key: string]: string } = {};
  return {
    tags,
    styles,
    translate: {
      foreground: c =>
        (styles['color'] = c.length === 7 ? c : utils.rrrrggggbbbbbToRrggbb(c)),
      background: c =>
        (styles['background-color'] =
          c.length === 7 ? c : utils.rrrrggggbbbbbToRrggbb(c)),
      underline: () => (styles['text-decoration'] = 'underline'),
      strikethrough: () => (styles['text-decoration'] = 'line-through'),
      width: c => (styles['width'] = `${c}px`),
      height: c => (styles['height'] = `${c}px`),
      justification: c => {
        if (c) {
          if (c !== 'left') {
            lineStyles['text-align'] = justificationMap['text-align'][c];
          }
        }
      },
      weight: () => tags.push(['strong', {}]),
      style: () => tags.push(['em', {}]),
      scale: c => tags.push([c, {}]), // todo: complete this
      family: () => (
        tags.push(['code', {}]),
        (styles['background-color'] = styles['background-color'] || '#2B2B2B')
      ),
      link: c => tags.push(['a', utils.parseLink(c)]),
    },
  };
};
const whiteListedAttributes = {
  containsNewLine: true,
};
const translateAttributesToHtmlAndCss = xml =>
  xml.map(inlineNodes => {
    const lineStyles = {};
    return [
      inlineNodes.map(node => {
        const translator = createTranslatedNode(lineStyles);
        if (node.$) {
          Object.entries(node.$).forEach(([key, value]) => {
            try {
              translator.translate[key](value);
            } catch {
              if (!whiteListedAttributes[key])
                throw new Error(
                  `Exception in the interpreter: translator[${key}] is not defined
                  value: ${value}
                  `,
                );
            }
          });
          if (node.type) {
            node.style = translator.styles;
            if (node.$?.link) {
              node.linkAttributes = translator.tags.find(
                ([tagName]) => tagName === 'a',
              )[1];
            }
          } else {
            node.tags = translator.tags;
            if (node.tags.length) {
              node.tags[0][1] = {
                ...node.tags[0][1],
                style: translator.styles,
              };
            } else {
              node.tags.push(['span', { style: translator.styles }]);
            }
            delete node.$;
          }
        }

        return node;
      }),
      ...[Object.keys(lineStyles).length ? lineStyles : undefined].filter(
        Boolean,
      ),
    ];
  });
export {
  translateAttributesToHtmlAndCss,
  preferences as cssPreferences,
  utils as xmlAttributesToCssUtils,
};

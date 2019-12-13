import { parseString } from 'xml2js';
const utils = {
  rrrrggggbbbbbToRrggbb: c => c[0] + c[1] + c[2] + c[5] + c[6] + c[9] + c[10]
};
const createTranslator = (
  tags: string[],
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
    family: () => tags.push('code')
  };
};
const interpreter = ogObject => {
  const tags = [];
  const styles = {};
  const translator = createTranslator(tags, styles);
  Object.entries(ogObject).forEach(([key, value]) => {
    translator[key](value);
  });
  // @ts-ignore
  styles.tags = tags;
  return styles;
};

const parseRichText = ({ xml, stringify }) =>
  new Promise((resolve, reject) => {
    parseString(xml, async function(err, result) {
      if (err) reject(err);
      else {
        const mappedRes = result.node.rich_text.map(node => {
          if (typeof node === 'object') {
            node.$$ = interpreter(node.$);
          }
          return node;
        });

        resolve(stringify ? JSON.stringify(mappedRes) : mappedRes);
      }
    });
  });
export { interpreter, parseRichText };

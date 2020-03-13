import { cloneObj } from '../../execK/helpers';

const tagsToRename = {
  p: 'span',
  div: 'span',
  pre: 'span',
  var: 'span',
  dt: 'span',
  dl: 'span',
  dd: 'span'
};
const stylePropertiesToRename = {
  'text-decoration-style': {
    propertyName: 'text-decoration',
    valueTransformer: v => v
  },
  background: {
    propertyName: 'background-color',
    valueTransformer: v => {
      const el = document.createElement('span');
      el.style.background = v;
      return el.style['background-color'];
    }
  }
};
const stylePropertiesToKeep = [
  'color',
  'font-style',
  'font-weight',
  'text-align',
  'background-color',
  'background',
  'text-decoration-style',
  'text-decoration'
];
const styleValuesToIgnore = ['inherit', 'initial', 'left', 'start'];
const headers = Array.from({ length: 6 }).map((_, i) => `h${i + 1}`);

const transformStyles = val => {
  if (val.tags)
    val.tags = val.tags.reduce((acc, val, i) => {
      acc.push(val);
      if (val[1].style) {
        if (val[1].style['font-weight']) {
          if (val[1].style['font-weight'] > 500) acc.push(['strong', {}]);
          delete val[1].style['font-weight'];
        }
        if (val[1].style['font-style']) {
          if (val[1].style['font-style'] === 'italic') acc.push(['em', {}]);
          delete val[1].style['font-style'];
        }
      }
      return acc;
    }, []);

  return val;
};

const collapseTags = val => {
  if (val.tags)
    val.tags = val.tags.reduce((acc, val, i) => {
      const previousTagWithSameName = acc.findIndex(tag => tag[0] === val[0]); //acc[i - 1] && acc[i - 1][0] === val[0];
      if (previousTagWithSameName !== -1) {
        const styleOfPreviousTag = acc[previousTagWithSameName][1].style || {};
        const stylesOfCollapsedTag = val[1].style;
        acc[previousTagWithSameName][1].style = {
          ...styleOfPreviousTag,
          ...stylesOfCollapsedTag
        };
      } else acc.push(val);
      return acc;
    }, []);

  return val;
};

const cleanStyleAndRenameTags = (
  options = { keepClassAttribute: false }
) => val => {
  if (val.tags)
    val.tags = val.tags.map(([tagName, attributes]) => {
      return [
        tagsToRename[tagName] ? tagsToRename[tagName] : tagName,
        {
          ...(attributes.class &&
            options.keepClassAttribute && { class: attributes.class }),
          ...(attributes.href && { href: attributes.href }),
          ...(attributes.src && { src: attributes.src }),
          ...(attributes.style && {
            style: Object.entries(attributes.style).reduce(
              (acc, [styleName, styleValue]) => {
                if (
                  stylePropertiesToKeep.includes(styleName) &&
                  !styleValuesToIgnore.includes(styleValue as string)
                )
                  stylePropertiesToRename[styleName]
                    ? (acc[
                        stylePropertiesToRename[styleName].propertyName
                      ] = stylePropertiesToRename[styleName].valueTransformer(
                        styleValue
                      ))
                    : (acc[styleName] = styleValue);
                return acc;
              },
              {}
            )
          })
        }
      ];
    });
  return val;
};

const addEmptyLineBeforeHeader = (acc, val) => {
  const isHeader =
    typeof val === 'object' &&
    val.tags.some(([tagName]) => headers.includes(tagName));
  const isDefinitionDefinition =
    typeof val === 'object' && val.tags.some(([tagName]) => 'dd' === tagName);
  const isDefinitionTitle =
    typeof val === 'object' && val.tags.some(([tagName]) => 'dt' === tagName);
  if (isHeader) {
    acc.push('\n', val);
  } else if (isDefinitionDefinition) {
    val._ = `\&nbsp; &nbsp; ${val._ || ''}`;
    acc.push('\n', val);
  } else if (isDefinitionTitle) {
    acc.push('\n', val);
  } else {
    acc.push(val);
  }
  return acc;
};

const optimizeAHtml = (
  { aHtml },
  options = { addEmptyLineBeforeHeader: true, keepClassAttribute: false }
) => {
  return cloneObj(aHtml)
    .reduce(
      options.addEmptyLineBeforeHeader
        ? addEmptyLineBeforeHeader
        : (acc, val) => (acc.push(val), acc),
      []
    )
    .map(
      cleanStyleAndRenameTags({
        keepClassAttribute: options.keepClassAttribute
      })
    )
    .map(transformStyles)
    .map(collapseTags);
};

export { optimizeAHtml };

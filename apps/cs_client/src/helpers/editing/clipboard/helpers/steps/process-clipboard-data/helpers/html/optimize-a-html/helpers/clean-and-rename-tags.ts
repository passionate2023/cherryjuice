import {
  sizeTags,
  styleTags,
} from '::helpers/editing/execK/steps/apply-command/apply-tag/calculate-tag';

const tagsToRename = {
  // p: 'span',
  // div: 'span',
  // pre: 'span',
  // var: 'span',
  // dt: 'span',
  // dl: 'span',
  // dd: 'span'
  i: 'em',
  b: 'strong',
};

const tagsWhiteList = ['a', 'span', 'img', 'table', ...styleTags, ...sizeTags];

const stylePropertiesToKeep = [
  'color',
  'font-style',
  'font-weight',
  'text-align',
  'background-color',
  'background',
  'text-decoration-style',
  'text-decoration',
  'display',
];
const styleValuesToIgnore = [
  'inherit',
  'initial',
  'inline',
  'left',
  'start',
  'rgb(32, 33, 34)',
  'rgb(255, 255, 255)',
  'none rgb(255, 255, 255)',
];
const stylePropertiesToRename = {
  'text-decoration-style': {
    propertyName: 'text-decoration',
    valueTransformer: v => v,
  },
  background: {
    propertyName: 'background-color',
    valueTransformer: v => {
      const el = document.createElement('span');
      el.style.background = v;
      return el.style['background-color'];
    },
  },
};

export const cleanStyleAndRenameTags = (
  options = { keepClassAttribute: false },
) => val => {
  if (val.tags)
    val.tags = val.tags.map(([tagName, attributes]) => {
      return [
        tagsToRename[tagName]
          ? tagsToRename[tagName]
          : tagsWhiteList.includes(tagName)
          ? tagName
          : 'span',
        {
          ...(attributes.class &&
            options.keepClassAttribute && { class: attributes.class }),
          ...(attributes.href && { href: attributes.href }),
          ...(attributes.src && { src: attributes.src }),
          ...(attributes.target && { target: attributes.target }),
          ...(attributes['data-type'] && {
            ['data-type']: attributes['data-type'],
          }),
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
                        styleValue,
                      ))
                    : (acc[styleName] = styleValue);
                return acc;
              },
              {},
            ),
          }),
        },
      ];
    });
  return val;
};

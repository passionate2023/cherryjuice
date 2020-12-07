// const calculateStyle = ({
//                           ogStyle = '',
//                           styleToBeApplied,
//                           styleExists: styleExistsGlobally,
//                           tagIndex
//                         }: {
//   ogStyle: string;
//   styleToBeApplied: string;
//   styleExists: boolean;
//   tagIndex: number;
// }) => {
//   if (styleExistsGlobally) {
//     ogStyle = ogStyle.replace(styleToBeApplied, '');
//   } else if (tagIndex === 0) {
//     ogStyle += ogStyle.includes(styleToBeApplied) ? '' : styleToBeApplied;
//   }
//   return ogStyle;
// };

import { calculateStyle } from '::editor/helpers/execK/steps/apply-command/apply-style/calculate-style';

type TApplyStyle = {
  aHtmlElement: any;
  style: { property: string; value: string };
  styleExists: boolean;
};
const applyStyle = ({
  aHtmlElement,
  style: { property, value },
  styleExists,
}: TApplyStyle) => {
  aHtmlElement.tags = aHtmlElement.tags.map(
    ([tagName, attributes], tagIndex) => [
      tagName,
      {
        ...attributes,
        // style: calculateStyle({
        //   ogStyle: attributes.style,
        //   styleToBeApplied: style,
        //   styleExists,
        //   tagIndex
        // })
        style: calculateStyle({
          ogStyle: attributes.style || {},
          cmd: { property, value, remove: styleExists },
          topLevelElement: tagIndex === aHtmlElement.tags.length - 1,
        }),
      },
    ],
  );
};

export { applyStyle };

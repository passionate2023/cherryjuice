const calculateStyle = ({
  ogStyle = '',
  styleToBeApplied,
  styleExists: styleExistsGlobally,
  tagIndex
}: {
  ogStyle: string;
  styleToBeApplied: string;
  styleExists: boolean;
  tagIndex: number;
}) => {
  if (styleExistsGlobally) {
    ogStyle = ogStyle.replace(styleToBeApplied, '');
  } else if (tagIndex === 0) {
    ogStyle += ogStyle.includes(styleToBeApplied) ? '' : styleToBeApplied;
  }
  return ogStyle;
};

type TApplyStyle = { aHtmlElement: any; style: string; styleExists: boolean };
const applyStyle = ({ aHtmlElement, style, styleExists }: TApplyStyle) => {
  aHtmlElement.tags = aHtmlElement.tags.map(
    ([tagName, attributes], tagIndex) => [
      tagName,
      {
        ...attributes,
        style: calculateStyle({
          ogStyle: attributes.style,
          styleToBeApplied: style,
          styleExists,
          tagIndex
        })
      }
    ]
  );
};

export { applyStyle };

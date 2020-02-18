const calculateStyle = ({
  ogStyle = '',
  styleToBeApplied,
  styleExists: styleExistsGlobally
}: {
  ogStyle: string;
  styleToBeApplied: string;
  styleExists: boolean;
}) => {
  if (styleExistsGlobally) {
    ogStyle = ogStyle.replace(styleToBeApplied, '');
  } else {
    ogStyle += ogStyle.includes(styleToBeApplied) ? '' : styleToBeApplied;
  }
  return ogStyle;
};

type TApplyStyle = { aHtmlElement: any; style: string; styleExists: boolean };
const applyStyle = ({ aHtmlElement, style, styleExists }: TApplyStyle) => {
  aHtmlElement.tags = aHtmlElement.tags.map(([tagName, attributes]) => [
    tagName,
    {
      ...attributes,
      style: calculateStyle({
        ogStyle: attributes.style,
        styleToBeApplied: style,
        styleExists
      })
    }
  ]);
};

export { applyStyle };

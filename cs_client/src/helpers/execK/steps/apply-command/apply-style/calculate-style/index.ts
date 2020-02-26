const multiValueProperties = ['text-decoration'];
const removeProperty = ({ ogStyle, property, value }) => {
  const existingValue = ogStyle[property] || '';
  const isMultiValueProperty = multiValueProperties.includes(property);
  let newValue;
  if (isMultiValueProperty) {
    newValue = existingValue.replace(value, '');
  } else {
    newValue = '';
  }
  const newStyle = {
    ...ogStyle,
    [property]: newValue.trim()
  };
  if (!newValue) delete newStyle[property];
  return newStyle;
};

const applyProperty = ({ ogStyle, property, value }) => {
  const existingValue = ogStyle[property] || '';
  let newValue;
  const isMultiValueProperty = multiValueProperties.includes(property);
  if (isMultiValueProperty) {
    newValue =
      existingValue + (existingValue.includes(value) ? '' : ` ${value}`);
  } else {
    newValue = `${value}`;
  }
  const newStyle = {
    ...ogStyle,
    [property]: newValue.trim()
  };
  if (!newValue) delete newStyle[property];
  return newStyle;
};
type TStyleObject = { [property: string]: string };
type TApplyStyle = {
  cmd: { property: string; value: string; remove?: boolean };
  ogStyle: TStyleObject;
  topLevelElement: boolean;
};
const calculateStyle = ({
  cmd: { property, value, remove },
  ogStyle,
  topLevelElement
}: TApplyStyle): TStyleObject =>
  remove
    ? removeProperty({ ogStyle, value, property })
    : topLevelElement
    ? applyProperty({ ogStyle, value, property })
    : ogStyle;

export { calculateStyle };

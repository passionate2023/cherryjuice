import { ExecKCommand } from '::helpers/execK';
type TLineStyle = {
  line: { [p: string]: string };
  // wrapper: { [p: string]: string };
};
const justificationMap = {
  right: 'flex-end',
  center: 'center',
  fill: 'space-between',
};
const justify = ({
  aHtmlElement,
  command,
  lineStyle,
}: {
  aHtmlElement: any;
  command: ExecKCommand;
  lineStyle: TLineStyle;
}) => {
  if (!aHtmlElement.tags[0][1].style) aHtmlElement.tags[0][1].style = {};
  if (!(command && command !== ExecKCommand.justifyLeft)) {
    lineStyle.line['display'] = 'block';
    lineStyle.line['justify-content'] = 'flex-start';
  } else {
    lineStyle.line['display'] = 'flex';
    lineStyle.line['justify-content'] = justificationMap[command];
  }
};

export { justify };
export { TLineStyle };

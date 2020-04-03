import { ExecKCommand } from '::helpers/execK';
type TLineStyle = {
  line: { [p: string]: string };
  delete: string[];
  deleteAll: boolean;
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
  if (command === ExecKCommand.justifyLeft) {
    lineStyle.delete.push('display');
    lineStyle.delete.push('justify-content');
  } else {
    lineStyle.line['display'] = 'flex';
    lineStyle.line['justify-content'] = justificationMap[command];
  }
};

export { justify };
export { TLineStyle };

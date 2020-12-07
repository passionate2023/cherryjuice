import { ExecKCommand } from '::editor/helpers/execK/execk-commands';

type TLineStyle = {
  line: { [p: string]: string };
  delete: string[];
  deleteAll: boolean;
};
const justificationMap = {
  'text-align': {
    right: 'end',
    center: 'center',
    fill: 'justify',
  },
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
    lineStyle.delete.push('text-align');
  } else {
    lineStyle.line['text-align'] = justificationMap['text-align'][command];
  }
};

export { justify };
export { TLineStyle };

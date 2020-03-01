import { ExecKCommand } from '::helpers/execK';
type TLineStyle = {
  line: { [p: string]: string };
  wrapper: { [p: string]: string };
};
const justify = ({
  aHtmlElement,
  command,
  lineStyle
}: {
  aHtmlElement: any;
  command: ExecKCommand;
  lineStyle: TLineStyle;
}) => {
  if (!aHtmlElement.tags[0][1].style) aHtmlElement.tags[0][1].style = {};
  if (aHtmlElement.nodeType) {
    // if (command === ExecKCommand.justifyRight) {
    //   aHtmlElement.tags[0][1].style['margin-left'] = 'auto';
    // }
    // if (command === ExecKCommand.justifyCenter) {
    //   aHtmlElement.tags[0][1].style['margin-right'] = 'auto';
    // }
  } else {
    aHtmlElement.tags[0][1].style['text-align'] = command;
    aHtmlElement.tags[0][1].style['flex'] = '1';
    // lineStyle.wrapper['flex'] = '1';
    // lineStyle.wrapper['text-align'] = command;
  }
  if (command && command !== ExecKCommand.justifyLeft) {
    lineStyle.line['display'] = 'flex';
  } else {
    delete aHtmlElement.tags[0][1].style['text-align'];
    delete aHtmlElement.tags[0][1].style['flex'];
    lineStyle.line['display'] = '';
  }
};

export { justify };
export { TLineStyle };

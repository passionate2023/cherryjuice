import { compose } from 'ramda';
import { translateAHtml } from './helpers/translate-ahtml/translate-ahtml';
import { separateXmlAndObjects } from './helpers/separate-xml-and-objects/separate-xml-and-objects';
const aHtmlToCtb = compose(separateXmlAndObjects, translateAHtml);

export { aHtmlToCtb };

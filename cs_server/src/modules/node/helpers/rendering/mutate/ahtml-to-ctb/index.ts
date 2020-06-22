import { compose } from 'ramda';
import { aHtmlToMidPipe } from './steps/ahtml-to-mid-pipe';
import { midPipeToCtb } from './steps/mid-pipe-to-ctb';
const aHtmlToCtb = compose(midPipeToCtb, aHtmlToMidPipe);

export { aHtmlToCtb };

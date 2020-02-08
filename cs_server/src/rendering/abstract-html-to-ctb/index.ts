import { compose } from 'ramda';
import { pseudoHtmlToMidPipe } from './steps/pseudo-html-to-mid-pipe';
import { midPipeToCtb } from './steps/mid-pipe-to-ctb';
const abstractHtmlToCtb = compose(midPipeToCtb, pseudoHtmlToMidPipe);

export { abstractHtmlToCtb };

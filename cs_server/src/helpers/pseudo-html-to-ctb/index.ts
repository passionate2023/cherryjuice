import { compose } from 'ramda';
import { pseudoHtmlToMidPipe } from './steps/1_pseudo-html-to-mid-pipe';
import { midPipeToCtb } from './steps/2_mid-pipe-to-ctb';
const htmlToCtb = compose(midPipeToCtb, pseudoHtmlToMidPipe);

export { htmlToCtb };

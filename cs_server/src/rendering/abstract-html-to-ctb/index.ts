import { compose } from 'ramda';
import { abstractHtmlToMidPipe } from './steps/abstract-html-to-mid-pipe';
import { midPipeToCtb } from './steps/mid-pipe-to-ctb';
const abstractHtmlToCtb = compose(
  midPipeToCtb,
  abstractHtmlToMidPipe,
);

export { abstractHtmlToCtb };

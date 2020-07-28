import * as React from 'react';
import { modInfoBar } from '::sass-modules/';

type Props = {
  noSelectedDocument: boolean;
};

const NoSelectedDocument: React.FC<Props> = ({ noSelectedDocument }) => {
  return (
    <span className={modInfoBar.infoBar__placeHolder}>
      {noSelectedDocument ? 'No selected document' : 'No selected node'}
    </span>
  );
};

export { NoSelectedDocument };

import * as React from 'react';
import modLinearProgress from '::sass-modules/shared-components/linear-progress.scss';
import { useSpinner } from '::hooks/use-spinner';

type Props = {
  loading: boolean;
  showAfter?: number;
};

const LinearProgress: React.FC<Props> = ({
  loading = true,
  showAfter = 350,
}) => {
  const show = useSpinner({ showAfter });

  return (
    <>
      {show && loading && (
        <div
          role="progressbar"
          className={`mdc-linear-progress mdc-linear-progress--indeterminate ${modLinearProgress.linearProgress}`}
        >
          {/*<div className="mdc-linear-progress__buffering-dots" />*/}
          {/*<div className="mdc-linear-progress__buffer" />*/}
          <div className="mdc-linear-progress__bar mdc-linear-progress__primary-bar">
            <span className="mdc-linear-progress__bar-inner" />
          </div>
          <div className="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
            <span className="mdc-linear-progress__bar-inner" />
          </div>
        </div>
      )}
    </>
  );
};

export { LinearProgress };

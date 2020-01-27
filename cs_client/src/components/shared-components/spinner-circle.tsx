import modSpinnerCircle from '::sass-modules/spinner-circle.scss';
import * as React from 'react';
import { useSpinner } from '::hooks/use-spinner';

type Props = {
  showAfter?: number;
};

const SpinnerCircle: React.FC<Props> = () => {
  const show = useSpinner();
  return (
    <>
      {show && (
        <svg
          className={modSpinnerCircle.spinnerCircle}
          width="65px"
          height="65px"
          viewBox="0 0 66 66"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className={modSpinnerCircle.spinnerCircle__path}
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            cx="33"
            cy="33"
            r="30"
          />
        </svg>
      )}
    </>
  );
};

export { SpinnerCircle };

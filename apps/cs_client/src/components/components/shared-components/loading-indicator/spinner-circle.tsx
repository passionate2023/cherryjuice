import modSpinnerCircle from '::sass-modules/shared-components/spinner-circle.scss';
import * as React from 'react';
import { useLoader } from '@cherryjuice/shared-helpers';

type Props = {
  showAfter?: number;
  style?: React.StyleHTMLAttributes<any>;
};

const SpinnerCircle: React.FC<Props> = ({ style = {} }) => {
  const show = useLoader();
  return (
    <>
      {show && (
        <svg
          className={modSpinnerCircle.spinnerCircle}
          width="65px"
          height="65px"
          viewBox="0 0 66 66"
          xmlns="http://www.w3.org/2000/svg"
          style={style}
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

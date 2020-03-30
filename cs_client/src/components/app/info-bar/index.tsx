import * as React from 'react';
import { formatTime } from '::helpers/time';
import { modInfoBar } from '../../../assets/styles/modules';
import { TState } from '../reducer';

const defaultProps = { is_richtxt: '', ts_creation: '', ts_lastsave: '' };
type Props = {
  node?: any;
  state: TState;
};
const doubleSpace = '\u00A0 ';
const Separator = () => (
  <span className={modInfoBar.infoBar__separator}>
    {`${doubleSpace}-${doubleSpace}`}
  </span>
);

const InfoBar: React.FC<Props> = ({
  node,
  state: { showInfoBar, isOnMobile },
}) => {
  let { is_richtxt, ts_creation, ts_lastsave } = node ? node : defaultProps;
  return (
    <>
      {!isOnMobile || showInfoBar ? (
        node && node.ts_creation ? (
          <footer className={modInfoBar.infoBar}>
            <span>Node Type: {is_richtxt ? 'Rich Text' : 'Plain Text'}</span>
            <Separator />
            <span>
              Date created:
              {formatTime(ts_creation)}
            </span>
            <Separator />
            <span>Date modified {formatTime(ts_lastsave)}</span>
          </footer>
        ) : (
          <footer className={modInfoBar.infoBar}>
            <span className={modInfoBar.infoBar__placeHolder}>
              No selected node
            </span>
          </footer>
        )
      ) : (
        <></>
      )}
    </>
  );
};

// export { InfoBar };
export default InfoBar;

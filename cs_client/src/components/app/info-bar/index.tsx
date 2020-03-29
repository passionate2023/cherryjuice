import modInfoBar from '::sass-modules/info-bar.scss';
import * as React from 'react';
import { formatTime } from '::helpers/time';

const defaultProps = { is_richtxt: '', ts_creation: '', ts_lastsave: '' };
type Props = {
  node?: any;
};

const InfoBar: React.FC<Props> = ({ node }) => {
  let { is_richtxt, ts_creation, ts_lastsave } = node ? node : defaultProps;
  return (
    <>
      {node && node.ts_creation ? (
        <footer className={modInfoBar.infoBar}>
          Node Type: {is_richtxt ? 'Rich Text' : 'Plain Text'} - Date created:
          {formatTime(ts_creation)} - Date modified {formatTime(ts_lastsave)}
        </footer>
      ) : (
        <footer className={modInfoBar.infoBar} />
      )}
    </>
  );
};

// export { InfoBar };
export default InfoBar;

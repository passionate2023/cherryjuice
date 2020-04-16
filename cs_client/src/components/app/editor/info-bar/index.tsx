import * as React from 'react';
import { formatTime } from '::helpers/time';
import { modInfoBar } from '::sass-modules/index';
import { TState } from '::app/reducer';

const defaultProps = { is_richtxt: '', createdAt: '', updatedAt: '' };
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
  let { is_richtxt, createdAt, updatedAt } = node ? node : defaultProps;
  return (
    <>
      {!isOnMobile || showInfoBar ? (
        node && node.createdAt ? (
          <footer className={modInfoBar.infoBar}>
            <span>Node Type: {is_richtxt ? 'Rich Text' : 'Plain Text'}</span>
            <Separator />
            <span>
              Date created:
              {formatTime(createdAt)}
            </span>
            <Separator />
            <span>Date modified {formatTime(updatedAt)}</span>
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

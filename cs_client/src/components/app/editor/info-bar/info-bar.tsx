import * as React from 'react';
import { formatTime } from '::helpers/time';
import { modInfoBar } from '::sass-modules/index';

import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::root/store/store';
import { router } from '::root/router/router';

const mapState = (state: Store) => ({
  node: state.document.nodes?.get(state.document.selectedNode?.node_id),
  documentId: state.document.documentId,
  isOnMobile: state.root.isOnMobile,
  showInfoBar: state.editor.showInfoBar,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};
const defaultProps = { createdAt: '', updatedAt: '' };
const doubleSpace = '\u00A0 ';
const Separator = () => (
  <span className={modInfoBar.infoBar__separator}>
    {`${doubleSpace}-${doubleSpace}`}
  </span>
);

const InfoBar: React.FC<Props & PropsFromRedux> = ({
  node,
  documentId,
  isOnMobile,
  showInfoBar,
}) => {
  const { createdAt, updatedAt } = node ? node : defaultProps;
  return (
    <>
      {!isOnMobile || showInfoBar ? (
        node && node.createdAt ? (
          <footer className={modInfoBar.infoBar}>
            <span>
              {'Date created: '}
              {formatTime(createdAt)}
            </span>
            <Separator />
            <span>
              {'Date modified: '} {formatTime(updatedAt)}
            </span>
          </footer>
        ) : (
          <footer className={modInfoBar.infoBar}>
            <span className={modInfoBar.infoBar__placeHolder}>
              {!documentId && router.location.pathname === '/'
                ? 'No selected document'
                : 'No selected node'}
            </span>
          </footer>
        )
      ) : (
        <></>
      )}
    </>
  );
};

const _ = connector(InfoBar);
export default _;

import * as React from 'react';
import { modInfoBar } from '::sass-modules';
import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::store/store';
import { router } from '::root/router/router';
import { VisibilityIcon } from '::root/components/app/components/editor/info-bar/components/components/visibility-icon';
import { Timestamps } from '::root/components/app/components/editor/info-bar/components/components/timestamp';
import { NoSelectedDocument } from '::root/components/app/components/editor/info-bar/components/components/no-selected-document';
import { getCurrentDocument } from '::store/selectors/cache/document/document';

const mapState = (state: Store) => {
  const document = getCurrentDocument(state);
  const node = document?.nodes
    ? document.nodes[document.state.selectedNode_id]
    : undefined;
  return {
    node,
    documentId: state.document.documentId,
    isOnMobile: state.root.isOnMobile,
    showInfoBar: state.editor.showInfoBar,
    documentPrivacy: document?.privacy,
  };
};
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};

const InfoBar: React.FC<Props & PropsFromRedux> = ({
  node,
  documentId,
  isOnMobile,
  showInfoBar,
  documentPrivacy,
}) => {
  const showBar = !isOnMobile || showInfoBar;
  const noSelectedDocument =
    !documentId && router.get.location.pathname === '/';
  return showBar ? (
    <footer className={modInfoBar.infoBar}>
      <div className={modInfoBar.infoBar__group}>
        {node?.createdAt ? (
          <Timestamps node={node} />
        ) : (
          <NoSelectedDocument noSelectedDocument={noSelectedDocument} />
        )}
      </div>
      <div className={modInfoBar.infoBar__group}>
        {!noSelectedDocument && <VisibilityIcon privacy={documentPrivacy} />}
      </div>
    </footer>
  ) : (
    <></>
  );
};

const _ = connector(InfoBar);
export default _;
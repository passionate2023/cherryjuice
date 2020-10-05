import * as React from 'react';
import { modInfoBar } from '::sass-modules';
import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::store/store';
import { VisibilityIcon } from '::root/components/app/components/editor/info-bar/components/components/visibility-icon';
import { Timestamps } from '::root/components/app/components/editor/info-bar/components/components/timestamp';
import { NoSelectedDocument } from '::root/components/app/components/editor/info-bar/components/components/no-selected-document';
import { getCurrentDocument } from '::store/selectors/cache/document/document';
import { Icon, Icons } from '::root/components/shared-components/icon/icon';

const mapState = (state: Store) => {
  const document = getCurrentDocument(state);
  const selectedNode_id = document?.persistedState?.selectedNode_id;
  const node = document?.nodes ? document.nodes[selectedNode_id] : undefined;
  return {
    node,
    documentId: state.document.documentId,
    isOnMobile: state.root.isOnMd,
    online: state.root.online,
    showInfoBar: state.editor.showInfoBar,
    documentPrivacy: document?.privacy,
    numberOfGuests: document?.guests?.length,
    selectedNode_id,
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
  selectedNode_id,
  numberOfGuests,
  online,
}) => {
  const showBar = !isOnMobile || showInfoBar;
  const noSelectedDocument = !documentId;
  return showBar ? (
    <footer className={modInfoBar.infoBar}>
      <div className={modInfoBar.infoBar__group}>
        {selectedNode_id && node ? (
          <Timestamps node={node} />
        ) : (
          <NoSelectedDocument noSelectedDocument={noSelectedDocument} />
        )}
      </div>
      <div className={modInfoBar.infoBar__group}>
        {!online && (
          <Icon
            name={Icons.material['no-connection']}
            loadAsInlineSVG={'force'}
            size={20}
          />
        )}
        {!noSelectedDocument && (
          <VisibilityIcon
            privacy={documentPrivacy}
            numberOfGuests={numberOfGuests}
            displayNumberOfGuestsAsBadge={false}
          />
        )}
      </div>
    </footer>
  ) : (
    <></>
  );
};

const _ = connector(InfoBar);
export default _;

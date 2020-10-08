import * as React from 'react';
import { dTM } from '::store/ducks/document-cache/document-cache';
import { CollapsableListItemProps } from '::root/components/app/components/menus/widgets/components/collapsable-list/components/body/components/collapsable-list-item';
import { CollapsableList } from '::root/components/app/components/menus/widgets/components/collapsable-list/collapsable-list';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store, store } from '::store/store';
import { getDocuments } from '::store/selectors/cache/document/document';
import { UndoRedo } from '::root/components/app/components/menus/widgets/components/undo-action/components/undo-redo';
import { Icons } from '::root/components/shared-components/icon/icon';

const mapState = (state: Store) => ({
  nof: state.timelines.documentActionNOF,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};

const ChangesHistory: React.FC<Props & PropsFromRedux> = ({ nof }) => {
  const documents = getDocuments(store.getState());
  const frames = dTM.current?.getFramesMeta() || [];
  const firstFrameIsAvailable = frames[0] && frames[0][0] === 0;
  const items: CollapsableListItemProps[] = firstFrameIsAvailable
    ? [
        {
          name: 'initial state',
          description: '',
          active: dTM.current?.getPosition === -1,
          key: dTM.getCurrentId + '::initial-state',
          icon: Icons.material.document,
        },
      ]
    : [];
  if (dTM.current || nof.redo || nof.undo) {
    items.push(
      ...frames.map(([i, frame]) => {
        const document = documents[frame.documentId];
        const node = document.nodes[frame.node_id];
        return {
          name: frame.node_id
            ? node?.name || 'node ' + frame.node_id
            : document.name,
          description: frame.mutationType,
          active: dTM.current.getPosition === i,
          key: frame.timeStamp + '',
          icon: frame.node_id ? Icons.material.cherry : Icons.material.document,
        };
      }),
    );
  }
  const documentName = documents[dTM.getCurrentId]?.name;
  return (
    <CollapsableList
      items={items}
      text={`local changes - ${documentName}`}
      additionalHeaderButtons={
        <UndoRedo
          nof={nof}
          undo={ac.documentCache.undoDocumentAction}
          redo={ac.documentCache.redoDocumentAction}
        />
      }
    />
  );
};

const _ = connector(ChangesHistory);
export { _ as ChangesHistory };

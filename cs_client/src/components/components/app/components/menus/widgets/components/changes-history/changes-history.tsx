import * as React from 'react';
import { dTM } from '::store/ducks/cache/document-cache';
import { CollapsableListItemProps } from '::root/components/app/components/menus/widgets/components/collapsable-list/components/body/components/collapsable-list-item';
import { CollapsableList } from '::root/components/app/components/menus/widgets/components/collapsable-list/collapsable-list';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store, store } from '::store/store';
import { getDocuments } from '::store/selectors/cache/document/document';
import { UndoRedo } from '::root/components/app/components/menus/widgets/components/undo-action/components/undo-redo';

const mapState = (state: Store) => ({
  nof: state.timelines.documentActionNOF,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};

const ChangesHistory: React.FC<Props & PropsFromRedux> = ({ nof }) => {
  const documents = getDocuments(store.getState());
  const items: CollapsableListItemProps[] = [
    {
      name: 'initial state',
      description: '',
      active: dTM.current?.getPosition === -1,
    },
  ];
  if (dTM.current || nof.redo || nof.undo) {
    items.push(
      ...dTM.current.getFramesMeta().map((frame, i) => {
        const document = documents[frame.documentId];
        const node = document.nodes[frame.node_id];
        return {
          name: node?.name || document.name,
          description: frame.mutationType,
          active: dTM.current.getPosition === i,
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
          dark={true}
        />
      }
    />
  );
};

const _ = connector(ChangesHistory);
export { _ as ChangesHistory };

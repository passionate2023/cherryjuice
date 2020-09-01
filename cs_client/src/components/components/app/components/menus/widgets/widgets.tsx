import * as React from 'react';
import { Snackbar } from '::root/components/app/components/menus/widgets/components/snackbar/snackbar';
import { modWidgets } from '::sass-modules';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::store/store';
import { animated } from 'react-spring';
import { DocumentOperations } from '::root/components/app/components/menus/widgets/components/document-operations/document-operations';
import { useHubTransition } from '::root/components/app/components/menus/widgets/hooks/hub-transition';
import { UndoAction } from '::root/components/app/components/menus/widgets/components/undo-action/undo-action';

export type Widget = {
  component: JSX.Element;
  key: string;
};

const mapState = (state: Store) => ({
  imports: Object.values(state.documentOperations.imports),
  exports: Object.values(state.documentOperations.exports),
  message: state.dialogs.snackbar?.message,
  dialogIsOpen:
    state.root.isOnMobile &&
    (state.dialogs.showDocumentList ||
      state.dialogs.showSettingsDialog ||
      state.dialogs.showDocumentMetaDialog ||
      state.dialogs.showNodeMetaDialog),
  showNodeMetaUndoAction: state.timelines.showNodeMetaUndoAction,
  nodeMetaNumberOfFrames: state.timelines.nodeMetaNumberOfFrames,
  showDocumentMetaUndoAction: state.timelines.showDocumentMetaUndoAction,
  documentMetaNumberOfFrames: state.timelines.documentMetaNumberOfFrames,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};
const Widgets: React.FC<Props & PropsFromRedux> = ({
  imports,
  exports,
  message,
  dialogIsOpen,
  nodeMetaNumberOfFrames,
  showNodeMetaUndoAction,
  showDocumentMetaUndoAction,
  documentMetaNumberOfFrames,
}) => {
  const widgets: Widget[] = [];
  if (message)
    widgets.push({
      component: <Snackbar message={message} />,
      key: 'Snackbar',
    });
  if (showDocumentMetaUndoAction) {
    widgets.push({
      component: (
        <UndoAction
          actionName={'undo action'}
          numberOfFrames={documentMetaNumberOfFrames}
          undo={ac.documentCache.undoDocumentMeta}
          redo={ac.documentCache.redoDocumentMeta}
          hide={ac.timelines.hideDocumentMetaUndoAction}
        />
      ),
      key: 'UndoDocumentMeta',
    });
  }
  else if (showNodeMetaUndoAction) {
    widgets.push({
      component: (
        <UndoAction
          actionName={'undo action'}
          numberOfFrames={nodeMetaNumberOfFrames}
          undo={ac.documentCache.undoNodeMeta}
          redo={ac.documentCache.redoNodeMeta}
          hide={ac.timelines.hideNodeMetaUndoAction}
        />
      ),
      key: 'UndoNodeMeta',
    });
  }
  if (!dialogIsOpen && (imports.length || exports.length))
    widgets.push({
      component: <DocumentOperations imports={imports} exports={exports} />,
      key: 'DocumentOperations',
    });
  const { transitions, setRef } = useHubTransition({ widgets });

  return (
    <div className={modWidgets.widgets}>
      {transitions.map(({ key, item, props: style }) => (
        <animated.div
          style={style}
          ref={setRef(item)}
          key={key}
          className={modWidgets.widget}
        >
          {item.component}
        </animated.div>
      ))}
    </div>
  );
};

const _ = connector(Widgets);
export { _ as Widgets };

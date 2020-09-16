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
  operations: Object.values(state.documentOperations.operations),
  snackbar: state.dialogs.snackbar,
  dialogIsOpen:
    state.root.isOnMd &&
    (state.dialogs.showDocumentList ||
      state.dialogs.showSettingsDialog ||
      state.dialogs.showDocumentMetaDialog ||
      state.dialogs.showNodeMetaDialog),
  showUndoDocumentAction: state.timelines.showUndoDocumentAction,
  documentActionNOF: state.timelines.documentActionNOF,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};
const Widgets: React.FC<Props & PropsFromRedux> = ({
  operations,
  snackbar,
  dialogIsOpen,
  showUndoDocumentAction,
  documentActionNOF,
}) => {
  const widgets: Widget[] = [];
  if (snackbar?.message)
    widgets.push({
      component: <Snackbar snackbar={snackbar} />,
      key: 'Snackbar',
    });
  if (showUndoDocumentAction) {
    widgets.push({
      component: (
        <UndoAction
          actionName={'undo action'}
          numberOfFrames={documentActionNOF}
          undo={ac.documentCache.undoDocumentAction}
          redo={ac.documentCache.redoDocumentAction}
          hide={ac.timelines.hideUndoDocumentAction}
        />
      ),
      key: 'UndoDocumentAction',
    });
  }
  if (!dialogIsOpen && operations.length)
    widgets.push({
      component: <DocumentOperations operations={operations} />,
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

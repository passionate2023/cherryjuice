import * as React from 'react';
import { Snackbar } from '::root/components/app/components/menus/widgets/components/snackbar/snackbar';
import { modWidgets } from '::sass-modules';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::store/store';
import { animated } from 'react-spring';
import { DocumentOperations } from '::root/components/app/components/menus/widgets/components/document-operations/document-operations';
import { useHubTransition } from '::root/components/app/components/menus/widgets/hooks/hub-transition';
import { ActionSnackbar } from '::root/components/app/components/menus/widgets/components/undo-action/action-snackbar';
import { ChangesHistory } from '::root/components/app/components/menus/widgets/components/changes-history/changes-history';
import { UndoRedo } from '::root/components/app/components/menus/widgets/components/undo-action/components/undo-redo';

export type Widget = {
  component: JSX.Element;
  key: string;
};

const mapState = (state: Store) => ({
  operations: Object.values(state.documentOperations.operations),
  snackbar: state.dialogs.snackbar,
  showUndoDocumentAction: state.timelines.showUndoDocumentAction,
  showTimeline: state.timelines.showTimeline,
  documentActionNOF: state.timelines.documentActionNOF,
  showHome: state.home.show,
  tb: state.root.isOnTb,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

const Widgets: React.FC<PropsFromRedux> = ({
  operations,
  snackbar,
  showUndoDocumentAction,
  showTimeline,
  documentActionNOF,
  showHome,
  tb,
}) => {
  const widgets: Widget[] = [];

  if (snackbar?.message)
    widgets.push({
      component: <Snackbar snackbar={snackbar} />,
      key: snackbar.message,
    });
  if (showUndoDocumentAction) {
    widgets.push({
      component: (
        <ActionSnackbar
          actionName={'undo action'}
          hide={ac.timelines.hideUndoDocumentAction}
          buttons={
            <UndoRedo
              nof={documentActionNOF}
              undo={ac.documentCache.undoDocumentAction}
              redo={ac.documentCache.redoDocumentAction}
            />
          }
        />
      ),
      key: 'UndoDocumentAction',
    });
  }
  if (showTimeline && (documentActionNOF.redo || documentActionNOF.undo))
    widgets.push({
      component: <ChangesHistory />,
      key: 'ChangesHistory',
    });
  if (operations.length)
    widgets.push({
      component: <DocumentOperations operations={operations} />,
      key: 'DocumentOperations',
    });

  const { transitions, setRef } = useHubTransition({ widgets });

  return (
    <div
      className={modWidgets.widgets}
      style={{ bottom: showHome ? (tb ? 45 : 5) : undefined }}
    >
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

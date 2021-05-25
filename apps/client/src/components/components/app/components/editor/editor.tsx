import { Route } from 'react-router-dom';
import { Suspense } from 'react';
import * as React from 'react';
import { Void } from '::root/components/shared-components/react/void';
import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::store/store';
import { LinearProgress } from '::shared-components/loading-indicator/linear-progress';
import { useComponentIsReady } from '::root/hooks/is-ready';
import { joinClassNames } from '@cherryjuice/shared-helpers';
import { treePosition } from '::store/selectors/editor/tree-position';
import mod from './editor.scss';
const Document = React.lazy(() =>
  import('::root/components/app/components/editor/document/document'),
);
const InfoBar = React.lazy(() =>
  import('::root/components/app/components/editor/info-bar/info-bar'),
);

const mapState = (state: Store) => ({
  documentId: state.document.documentId,
  docking: state.root.docking,
  saveInProgress: state.document.asyncOperations.save === 'in-progress',
  treePosition: treePosition(state),
});
const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;

const Editor: React.FC<PropsFromRedux> = ({
  documentId,
  docking,
  saveInProgress,
  treePosition,
}) => {
  useComponentIsReady(true);
  return (
    <div
      className={joinClassNames([
        mod.editor,
        treePosition === 'bottom' && mod.editorTreeBottom,
      ])}
    >
      <LinearProgress loading={saveInProgress} />
      {!documentId && location.pathname === '/' ? (
        <></>
      ) : (
        <Route
          path={`/document/:file_id?/`}
          render={() => (
            <Suspense fallback={<Void />}>
              <Document />
            </Suspense>
          )}
        />
      )}
      <Suspense fallback={<Void />}>{!docking && <InfoBar />}</Suspense>
    </div>
  );
};
export default connector(Editor);
export { mod as modEditor };

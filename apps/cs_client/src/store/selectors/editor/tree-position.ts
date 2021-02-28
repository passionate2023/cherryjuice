import { createSelector } from 'reselect';
import { Store } from '::store/store';
import { TreePosition } from '::store/ducks/editor';

export const treePosition = createSelector(
  (state: Store) => state.editor.treePosition,
  (state: Store) => state.root.breakpoint.mbOrTb,
  (treePosition, mbOrTb): TreePosition => (mbOrTb ? treePosition : 'left'),
);

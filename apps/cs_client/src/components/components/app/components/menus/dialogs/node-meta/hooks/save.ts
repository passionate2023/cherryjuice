import { NodeCached } from '::types/graphql-adapters';
import { TNodeMetaState } from '::root/components/app/components/menus/dialogs/node-meta/reducer/reducer';
import { updateCachedHtmlAndImages } from '::root/components/app/components/editor/document/components/tree/components/node/helpers/apollo-cache';
import { useDelayedCallback } from '::hooks/react/delayed-callback';
import { ac } from '::store/store';
import { NodePrivacy } from '@cherryjuice/graphql-types';

const calculateNewStyle = (state: TNodeMetaState): string => {
  return JSON.stringify({
    ...(state.hasCustomColor && {
      color: state.customColor,
    }),
    ...(state.isBold && { fontWeight: 'bold' }),
    ...(state.hasCustomIcon && {
      icon_id: state.customIcon === '0' ? '1' : state.customIcon,
    }),
  });
};

const generateNewNode = ({
  node,
  newStyle,
  state,
}: {
  node: NodeCached;
  state: TNodeMetaState;
  newStyle: string;
}) => {
  return {
    ...node,
    name: state.name || '?',
    node_title_styles: newStyle,
    read_only: state.isReadOnly ? 1 : 0,
    child_nodes: [...node.child_nodes],
    privacy: state.privacy,
  };
};

type EditedNodeAttributes = {
  name?: string;
  node_title_styles?: string;
  read_only?: number;
  privacy?: NodePrivacy;
};
const calculateEditedAttribute = ({
  state,
  node,
  newStyle,
}: {
  node: NodeCached;
  state: TNodeMetaState;
  newStyle: string;
}): EditedNodeAttributes => {
  const diff: EditedNodeAttributes = {};
  const { node_title_styles } = node;
  const style = JSON.parse(node_title_styles);

  if (state.name !== node.name) diff.name = state.name;
  if (newStyle !== JSON.stringify(style)) {
    const noChanges = newStyle === '{}' && !style;
    if (!noChanges) diff.node_title_styles = newStyle;
  }
  if (state.isReadOnly !== Boolean(node.read_only))
    diff.read_only = state.isReadOnly ? 1 : 0;
  if (state.privacy !== node.privacy) diff.privacy = state.privacy;
  return diff;
};

type UseSaveProps = {
  node: NodeCached;
  newNode: boolean;
  state: TNodeMetaState;
  previous_sibling_node_id: number;
};
const useSave = ({
  node,
  newNode,
  state,
  previous_sibling_node_id,
}: UseSaveProps) => {
  return useDelayedCallback(ac.dialogs.hideNodeMeta, () => {
    const newStyle = calculateNewStyle(state);
    if (newNode) {
      updateCachedHtmlAndImages();
      const createdNode = generateNewNode({ node, state, newStyle });
      ac.documentCache.createNode({ createdNode, previous_sibling_node_id });
    } else {
      const editedAttribute = calculateEditedAttribute({
        state,
        node,
        newStyle,
      });
      if (Object.keys(editedAttribute).length) {
        ac.documentCache.mutateNodeMeta({
          node_id: node.node_id,
          documentId: node.documentId,
          data: editedAttribute,
        });
        // apolloCache.node.mutate({ nodeId, meta: editedAttribute });
      }
    }
  });
};

export { useSave };

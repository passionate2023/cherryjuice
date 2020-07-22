import { NodeCached } from '::types/graphql/adapters';
import { TNodeMetaState } from '::app/menus/node-meta/reducer/reducer';
import { apolloCache } from '::graphql/cache/apollo-cache';
import { updateCachedHtmlAndImages } from '::app/editor/document/tree/node/helpers/apollo-cache';
import { useDelayedCallback } from '::hooks/react/delayed-callback';
import { router } from '::root/router/router';
import { ac } from '::root/store/store';

const calculateDiff = ({
  isNewNode,
  node,
  state,
}: {
  isNewNode: boolean;
  node: NodeCached;
  state: TNodeMetaState;
}) => {
  const { name, node_title_styles, read_only } = node;
  const style = JSON.parse(node_title_styles);
  const newStyle = JSON.stringify({
    ...(state.hasCustomColor && {
      color: state.customColor,
    }),
    ...(state.isBold && { fontWeight: 'bold' }),
    ...(state.hasCustomIcon && {
      icon_id: state.customIcon === '0' ? '1' : state.customIcon,
    }),
  });
  let res;
  if (isNewNode) {
    res = {
      ...node,
      name: state.name || '?',
      node_title_styles: newStyle,
      read_only: state.isReadOnly ? 1 : 0,
      child_nodes: [...node.child_nodes],
    };
  } else {
    res = {};
    if (state.name !== name) res.name = state.name;
    if (newStyle !== JSON.stringify(style)) {
      const noChanges = newStyle === '{}' && !style;
      if (!noChanges) res.node_title_styles = newStyle;
    }
    if (state.isReadOnly !== Boolean(read_only))
      res.read_only = state.isReadOnly ? 1 : 0;
  }
  return res;
};

type UseSaveProps = {
  nodeId: string;
  node: NodeCached;
  newNode: boolean;
  state: TNodeMetaState;
  previous_sibling_node_id: number;
};
const useSave = ({
  node,
  newNode,
  nodeId,
  state,
  previous_sibling_node_id,
}: UseSaveProps) => {
  return useDelayedCallback(ac.dialogs.hideNodeMeta, () => {
    const res = calculateDiff({
      isNewNode: newNode,
      node,
      state,
    });
    if (newNode) {
      const fatherNode = apolloCache.node.get(res.fatherId);
      const position =
        previous_sibling_node_id === -1
          ? -1
          : fatherNode.child_nodes.indexOf(previous_sibling_node_id) + 1;
      if (!fatherNode.child_nodes.includes(res.node_id))
        position === -1
          ? fatherNode.child_nodes.push(res.node_id)
          : fatherNode.child_nodes.splice(position, 0, res.node_id);
      apolloCache.node.create(res);
      apolloCache.node.mutate({
        nodeId: fatherNode.id,
        meta: {
          child_nodes: fatherNode.child_nodes,
        },
      });
      updateCachedHtmlAndImages();
      router.goto.node(node.documentId, node.node_id);
    } else {
      if (Object.keys(res).length)
        apolloCache.node.mutate({ nodeId, meta: res });
    }
  });
};

export { useSave };

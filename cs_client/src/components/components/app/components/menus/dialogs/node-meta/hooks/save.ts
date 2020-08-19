import { NodeCached } from '::types/graphql-adapters';
import { TNodeMetaState } from '::root/components/app/components/menus/dialogs/node-meta/reducer/reducer';
import { updateCachedHtmlAndImages } from '::root/components/app/components/editor/document/components/tree/components/node/helpers/apollo-cache';
import { useDelayedCallback } from '::hooks/react/delayed-callback';
import { router } from '::root/router/router';
import { ac } from '::store/store';
import { NodePrivacy } from '::types/graphql/generated';
import { getNode } from '::store/selectors/cache/document/node';
import { interval } from 'rxjs';
import { filter, take, tap } from 'rxjs/operators';

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

const addToFatherChild_nodes = (
  father_child_nodes: number[],
  saved_node_id: number,
  previous_sibling_node_id: number,
) => {
  const child_nodes = father_child_nodes;
  const position =
    previous_sibling_node_id === -1
      ? -1
      : child_nodes.indexOf(previous_sibling_node_id) + 1;
  if (!child_nodes.includes(saved_node_id))
    position === -1
      ? child_nodes.push(saved_node_id)
      : child_nodes.splice(position, 0, saved_node_id);
  return [...child_nodes];
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
      const nodeToSave = generateNewNode({ node, state, newStyle });

      ac.documentCache.createNode(nodeToSave);
      interval(1)
        .pipe(
          filter(() => !!getNode(nodeToSave)),
          take(1),
          tap(() => {
            const fatherNode = getNode({
              node_id: nodeToSave.father_id,
              documentId: nodeToSave.documentId,
            });

            ac.documentCache.mutateNode({
              node_id: fatherNode.node_id,
              documentId: fatherNode.documentId,
              data: {
                child_nodes: addToFatherChild_nodes(
                  fatherNode.child_nodes,
                  nodeToSave.node_id,
                  previous_sibling_node_id,
                ),
              },
            });
            router.goto.node(node.documentId, node.node_id);
          }),
        )
        .subscribe();
      // apolloCache.node.create(nodeToSave);

      // apolloCache.node.mutate({
      //   nodeId: fatherNode.id,
      //   meta: {
      //     child_nodes: fatherNode.child_nodes,
      //   },
      // });
      updateCachedHtmlAndImages();
    } else {
      const editedAttribute = calculateEditedAttribute({
        state,
        node,
        newStyle,
      });
      if (Object.keys(editedAttribute).length) {
        ac.documentCache.mutateNode({
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

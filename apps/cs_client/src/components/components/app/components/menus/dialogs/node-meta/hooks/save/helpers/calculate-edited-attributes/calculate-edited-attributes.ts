import { MutateNodeData } from '::store/ducks/document-cache/helpers/node/mutate-node-meta';
import { stringifyNodeStyle } from '::app/components/menus/dialogs/node-meta/hooks/save/helpers/helpers/stringify-node-style';
import { NodePrivacy } from '@cherryjuice/graphql-types';
import { joinTags } from '::app/components/menus/dialogs/node-meta/hooks/save/helpers/helpers/join-tags';
import { QNodeMeta } from '::graphql/fragments/node-meta';
import { NodeMeta } from '::app/components/menus/dialogs/node-meta/reducer/reducer';

export type EditNodesProps = {
  nodeA: QNodeMeta;
  nodeBMeta: NodeMeta;
};

export const calculateEditedAttribute = ({
  nodeA,
  nodeBMeta,
}: EditNodesProps): MutateNodeData => {
  const diff: MutateNodeData = {};
  if (nodeA.name !== nodeBMeta.name) {
    diff.name = nodeBMeta.name;
  }
  if (Boolean(nodeA.read_only) !== nodeBMeta.isReadOnly) {
    diff.read_only = nodeBMeta.isReadOnly ? 1 : 0;
  }
  {
    const defaultPrivacy = nodeBMeta.privacy === NodePrivacy.DEFAULT;
    const unsetPrivacy = defaultPrivacy && !nodeA.privacy;
    const changeInPrivacy =
      !unsetPrivacy && nodeBMeta.privacy !== nodeA.privacy;
    if (changeInPrivacy) {
      diff.privacy = nodeBMeta.privacy;
    }
  }
  {
    const newTags = joinTags(nodeBMeta.tags);
    const changesInTags = nodeA.tags !== newTags;
    if (changesInTags) {
      diff.tags = newTags;
    }
  }
  if (Boolean(nodeA.read_only) !== nodeBMeta.isReadOnly) {
    diff.read_only = nodeBMeta.isReadOnly ? 1 : 0;
  }
  {
    const styleA = nodeA.node_title_styles;
    const styleB = stringifyNodeStyle(nodeBMeta);
    if (styleB !== styleA) {
      diff.node_title_styles = styleB;
    }
  }

  return diff;
};

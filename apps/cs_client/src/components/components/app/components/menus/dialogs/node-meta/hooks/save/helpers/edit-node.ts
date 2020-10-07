import { ac } from '::store/store';
import { NodeMeta } from '::root/components/app/components/menus/dialogs/node-meta/reducer/reducer';
import { NodePrivacy } from '@cherryjuice/graphql-types';
import { MutateNodeData } from '::store/ducks/cache/document-cache/helpers/node/mutate-node-meta';
import { QNodeMeta } from '::graphql/fragments/node-meta';

export const calculateNewStyle = ({
  customColor,
  customIcon,
  hasCustomColor,
  hasCustomIcon,
  isBold,
}: NodeMeta): string => {
  return JSON.stringify({
    ...(hasCustomColor && {
      color: customColor,
    }),
    ...(isBold && { fontWeight: 'bold' }),
    ...(hasCustomIcon && {
      icon_id: customIcon === '0' ? '1' : customIcon,
    }),
  });
};

export const joinTags = (tags: string[]): string | undefined =>
  tags.filter(Boolean).join(', ');

const calculateEditedAttribute = ({
  nodeA,
  nodeBMeta,
}: EditNodesProps): MutateNodeData => {
  const diff: MutateNodeData = {};
  const styleA = nodeA.node_title_styles;
  const styleB = calculateNewStyle(nodeBMeta);
  if (nodeBMeta.name !== nodeA.name) diff.name = nodeBMeta.name;
  if (styleB !== styleA) {
    const noChanges = styleB === '{}' && !styleA;
    if (!noChanges) diff.node_title_styles = styleB;
  }
  if (nodeBMeta.isReadOnly !== Boolean(nodeA.read_only))
    diff.read_only = nodeBMeta.isReadOnly ? 1 : 0;
  const noChangeInPrivacy =
    nodeBMeta.privacy === NodePrivacy.DEFAULT && !nodeA.privacy;
  if (!noChangeInPrivacy && nodeBMeta.privacy !== nodeA.privacy)
    diff.privacy = nodeBMeta.privacy;
  const noChangesInTags = !nodeA.tags && nodeBMeta.tags.length === 0;
  if (!noChangesInTags) diff.tags = joinTags(nodeBMeta.tags);
  return diff;
};

export type EditNodesProps = {
  nodeA: QNodeMeta;
  nodeBMeta: NodeMeta;
};

export const editNode = ({ nodeBMeta, nodeA }: EditNodesProps) => {
  const editedAttribute = calculateEditedAttribute({
    nodeBMeta,
    nodeA,
  });
  if (Object.keys(editedAttribute).length) {
    ac.documentCache.mutateNodeMeta({
      node_id: nodeA.node_id,
      documentId: nodeA.documentId,
      data: editedAttribute,
    });
  }
};

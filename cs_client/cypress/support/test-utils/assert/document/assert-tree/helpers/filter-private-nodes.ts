import {
  NodePrivacy,
  Privacy,
} from '../../../../../../../types/graphql/generated';
import { NodeAst } from '../../../../../../fixtures/node/generate-node';
import { privacyIsBelow } from '../../../../../../../src/components/app/menus/document-meta/components/select-privacy/select-privacy';
import { DocumentAst } from '../../../../../../fixtures/document/generate-document';
import { TreeAst } from '../../../../../../fixtures/tree/generate-tree';

const filterPrivateNodesOfLevel = (docPrivacy: Privacy) => (node: NodeAst) =>
  node.privacy && node.privacy !== NodePrivacy.DEFAULT
    ? !privacyIsBelow(node.privacy)(docPrivacy)
    : true;

export const filterPrivateNodes = (docAst: DocumentAst): TreeAst => {
  return docAst.tree.reduce(
    (acc, level) => {
      const levelLength = level.filter(
        filterPrivateNodesOfLevel(docAst.meta.privacy),
      ).length;
      if (levelLength > 0 && !acc.foundEmptyLevel) {
        acc.tree.push(level);
      } else {
        acc.foundEmptyLevel = true;
      }
      return acc;
    },
    { tree: [], foundEmptyLevel: false },
  ).tree;
};

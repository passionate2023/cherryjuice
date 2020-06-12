import { NodeAst } from './generate-node';
import { TreeAst } from '../tree/generate-tree';
import { removeArrayElement } from '../../support/helpers/javascript-utils';

const deleteNodeAndItsChildren = (tree: TreeAst) => treeMap => (
  node: NodeAst,
) => {
  node.children
    .map(id => treeMap.get(id))
    .forEach(deleteNodeAndItsChildren(tree)(treeMap));
  removeArrayElement(tree[node.levelIndex], node);
};

export { deleteNodeAndItsChildren };

import { wait } from '../../../../helpers/cypress-helpers';
import { TreeAst } from '../../../../../fixtures/tree/generate-tree';
import { dialogs } from '../../../dialogs/dialogs';

const createTree = ({ tree }: { tree: TreeAst }) => {
  for (const node of tree.flatMap(x => x)) {
    dialogs.nodeMeta.create({ node });
    wait.ms500();
  }
};

export { createTree };

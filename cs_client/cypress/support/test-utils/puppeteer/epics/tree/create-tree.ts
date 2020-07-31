import { TreeAst } from '../../../../../fixtures/tree/generate-tree';
import { puppeteer } from '../../puppeteer';

const createTree = ({ tree }: { tree: TreeAst }) => {
  for (const node of tree.flatMap(x => x)) {
    puppeteer.content.nodeMeta.create({ node });
  }
};

export { createTree };

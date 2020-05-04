import { Png } from './png';
import { Code } from './code';
import { Table } from './table';
import { Anchor } from './anchor/anchor';

const Tab = node =>
  Array.from({ length: node.length })
    .map((_, i) => (i % 2 === 0 ? '&nbsp;' : ' '))
    .join('');

const objects = {
  tab: Tab,
  anchor: Anchor,
  png: Png,
  code: Code,
  table: Table,
};

export { objects };

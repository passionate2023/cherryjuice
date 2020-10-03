import { Png } from './png';
import { Code } from './code';
import { Table } from './table';
import { Anchor } from './anchor/anchor';
import { SPACE } from '../helpers/escape-html';

const Tab = ({ length }: { length: number }): string =>
  Array.from({ length })
    .map(() => SPACE)
    .join('');

const objects = {
  tab: Tab,
  anchor: Anchor,
  png: Png,
  code: Code,
  table: Table,
};

export { objects };

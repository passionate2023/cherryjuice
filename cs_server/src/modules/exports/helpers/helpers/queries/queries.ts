import { Node } from '../../../../node/entities/node.entity';
import { aHtmlToCtb } from '../ahtml-to-ctb/ahtml-to-ctb';
import { insertIntoNode } from './insert/node';
import { insertIntoChildren } from './insert/children';
import { createTables } from './create/create-tables';
import { insertIntoCodeBox } from './insert/codebox';
import { insertIntoGrid } from './insert/grid';

const queries = {
  createTables: createTables,
  insertNode: ({ node, sequence }: { node: Node; sequence: number }) => {
    const { node_id, ahtml } = node;
    const preCTB = aHtmlToCtb(node_id)(JSON.parse(ahtml || '[]'));
    const txt = ahtml
      ? preCTB.xmlString
      : '<?xml version="1.0" ?><node><rich_text></rich_text></node>';

    const codeboxTable = preCTB.objects['codebox'].map(insertIntoCodeBox);
    const gridTable = preCTB.objects['grid'].map(insertIntoGrid);
    const childrenTable = insertIntoChildren({
      node,
      sequence,
    });
    const nodeTable = insertIntoNode({
      node,
      txt,
      hasObjects: {
        codebox: codeboxTable.length > 0 ? 1 : 0,
        grid: gridTable.length > 0 ? 1 : 0,
      },
    });
    return [
      nodeTable,
      childrenTable,
      ...codeboxTable,
      ...gridTable,
    ];
  },
};

export { queries };

import { Node } from '../../../../node/entities/node.entity';
import { aHtmlToCtb } from '../ahtml-to-ctb/ahtml-to-ctb';
import { insertIntoNode } from './insert/node';
import { insertIntoChildren } from './insert/children';
import { createTables } from './create/create-tables';
import { insertIntoCodeBox } from './insert/codebox';
import { insertIntoGrid } from './insert/grid';
import { insertIntoAnchor } from './insert/anchor';

const queries = {
  createTables: createTables,
  insertNode: ({ node, sequence }: { node: Node; sequence: number }) => {
    const { node_id, ahtml } = node;
    const preCTB = aHtmlToCtb(node_id)(JSON.parse(ahtml || '[]'));
    const txt = ahtml
      ? preCTB.xmlString
      : '<?xml version="1.0" ?><node><rich_text></rich_text></node>';

    const codeboxes = preCTB.objects['codebox'].map(insertIntoCodeBox);
    const grids = preCTB.objects['grid'].map(insertIntoGrid);
    const anchors = preCTB.objects['anchor'].map(insertIntoAnchor);
    const childrenRow = insertIntoChildren({
      node,
      sequence,
    });
    const nodeRow = insertIntoNode({
      node,
      txt,
      hasObjects: {
        codebox: codeboxes.length > 0 ? 1 : 0,
        grid: grids.length > 0 ? 1 : 0,
        anchor: anchors.length > 0 ? 1 : 0,
      },
    });
    return [nodeRow, childrenRow, ...codeboxes, ...grids, ...anchors];
  },
};

export { queries };

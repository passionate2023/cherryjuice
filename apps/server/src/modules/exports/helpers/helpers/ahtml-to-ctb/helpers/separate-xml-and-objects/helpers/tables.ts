import { AHtmlNode } from '@cherryjuice/ctb-to-ahtml'
import { CTBObject } from '../../translate-ahtml/helpers/translate-object/translate-object';

const extractObjects = (nodes: (AHtmlNode | CTBObject)[]) => {
  const state = {
    offset: 0,
  };
  return nodes.reduce(
    (acc, val) => {
      if (typeof val === 'object' && 'row' in val) {
        acc.otherTables[val.type].push({
          ...val['row'],
          offset: state.offset,
        });
        acc.nodes.push({ $: { justification: val['row'].justification } });
        state.offset += 1;
      } else {
        acc.nodes.push(val);
        state.offset +=
          typeof val === 'string'
            ? (val as string).length
            : val._
            ? val._.length
            : 0;
      }
      return acc;
    },
    {
      nodes: [],
      otherTables: { codebox: [], grid: [], anchor: [], image: [] },
    },
  );
};

export { extractObjects };
